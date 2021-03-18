const StyleDictionary = require('style-dictionary');
const pascalcase = require('pascalcase');

const colorProperties = ['primary', 'neutral'];

// https://github.com/dbanksdesign/style-dictionary-css-helpers/blob/master/formats/cssHelpers.js
// 3.0 docs https://github.com/amzn/style-dictionary/blob/7e47837cfad0aec1a75c14de6103ec23ed5aa2aa/docs/version_3.md
StyleDictionary.registerFormat({
  name: `utility-classes`,
  formatter: ({dictionary, platform, file, options}) => {
    return dictionary.allProperties
      .map((token) => {
        // If bg option and color is from design system
        // Let's create a utility class
        if (
          options.property === 'background-color' &&
          colorProperties.includes(token.attributes.type)
        ) {
          return `.${options.prefix}-${token.attributes.type}-${token.attributes.item} { ${options.property}: ${token.value} };`;
        }
        // If text-color option and color is from design system
        // Let's create a utility class
        if (
          options.prefix === 'text' &&
          options.property === 'color' &&
          colorProperties.includes(token.attributes.type)
        ) {
          return `.${options.prefix}-${token.attributes.type}-${token.attributes.item} { ${options.property}: ${token.value} };`;
        }
        // If padding let's create a utility class
        if (
          options.property === 'padding' &&
          token.attributes.type === 'spacing'
        ) {
          return `.${options.prefix}-${token.attributes.item} { ${options.property}: ${token.value} };`;
        }
        // If margin let's create a utility class
        if (
          options.property === 'margin' &&
          token.attributes.type === 'spacing'
        ) {
          return `.${options.prefix}-${token.attributes.item} { ${options.property}: ${token.value} };`;
        }
        return;
      })
      .join(`\n`);
  },
});

StyleDictionary.registerFormat({
  name: `utility-class-es6`,
  formatter: ({dictionary, platform, file, options}) => {
    return dictionary.allProperties
      .map((token) => {
        // If bg option and color is from design system
        // Let's create a utility class
        if (
          options.property === 'background' &&
          colorProperties.includes(token.attributes.type)
        ) {
          const name = pascalcase(
            `${options.prefix} ${token.attributes.type} ${token.attributes.item}`,
          );
          return `export const ${name} = "${options.prefix}-${token.attributes.type}-${token.attributes.item}";`;
        }
        // If text-color option and color is from design system
        // Let's create a utility class
        if (
          options.prefix === 'text' &&
          options.property === 'color' &&
          colorProperties.includes(token.attributes.type)
        ) {
          const name = pascalcase(
            `${options.prefix} ${token.attributes.type} ${token.attributes.item}`,
          );
          return `export const ${name} = "${options.prefix}-${token.attributes.type}-${token.attributes.item}";`;
        }
        // TODO: ES6 versions for margins/padding
        return;
      })
      .join(`\n`);
  },
});

module.exports = {
  source: ['tokens/**/*.json5'],
  transform: {
    // For backwards compatibility, all built-in transforms are not transitive
    // by default. This will make the 'color/css' transform transitive
    'color/css': Object.assign({}, StyleDictionary.transform[`color/css`], {
      transitive: true,
    }),
  },
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: './dist/',
      files: [
        {
          destination: 'base.scss',
          format: 'scss/variables',
          options: {
            outputRefereces: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: './build/',
      files: [
        {
          destination: 'base.js',
          format: 'javascript/es6',
        },
        {
          destination: 'background-color.js',
          format: 'utility-class-es6',
          options: {
            prefix: 'bg',
            property: 'background',
          },
        },
        {
          destination: 'text-color.js',
          format: 'utility-class-es6',
          options: {
            prefix: 'text',
            property: 'color',
          },
        },
      ],
    },
    css: {
      transforms: [`attribute/cti`, `name/cti/kebab`, `color/css`, `size/rem`],
      buildPath: './dist/',
      files: [
        {
          destination: 'base.css',
          format: 'css/variables',
        },
      ],
    },
    utilityClasses: {
      transformGroup: 'css',
      buildPath: './dist/',
      files: [
        {
          destination: 'background-color.css',
          format: 'utility-classes',
          options: {
            prefix: 'bg',
            property: 'background-color',
          },
        },
        {
          destination: 'text-color.css',
          format: 'utility-classes',
          options: {
            prefix: 'text',
            property: 'color',
          },
        },
        {
          destination: 'padding.css',
          format: 'utility-classes',
          options: {
            prefix: 'p',
            property: 'padding',
          },
        },
        {
          destination: 'margin.css',
          format: 'utility-classes',
          options: {
            prefix: 'm',
            property: 'margin',
          },
        },
      ],
    },
  },
};
