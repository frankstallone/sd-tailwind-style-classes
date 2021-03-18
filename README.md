# Style Dictionary w/ Tailwind Style Classes

This is a very basic implementation of Style Diciontary with a formatter used to make Tailwind Style classes for background, text colors, margins† and padding†. TypeScript was included for projects that want to use type safety for their design systems.

Example:

```js
<div className={`${BgPrimary100}`}>
```

† Tailwind has various outputs for margin/padding top, left, right, bottom and all four. We're only outputting all four in this demo repo.

## Installation

`yarn`

## Build

`yarn build`
