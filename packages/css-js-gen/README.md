# CSS-JS-Gen

[![NPM Version](https://img.shields.io/npm/v/css-js-gen)](https://npm.im/css-js-gen)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A TypeScript package that converts CSS object notation to CSS strings, providing a more maintainable alternative to template literals for generating CSS that needs to be inlined or exported as strings.

## Features

- ✅ **Type-safe CSS objects** - Full TypeScript support with autocomplete
- ✅ **Nested selectors** - Support for nested CSS rules with `&` parent selector
- ✅ **Media queries** - Built-in support for `@media` and other at-rules
- ✅ **Clean output** - Properly formatted and indented CSS strings
- ✅ **Zero dependencies** - Lightweight and fast

## Installation

```bash
pnpm install css-js-gen
```

## Usage

### Basic Example

```typescript
import { toCSS, css } from './src/index.js';

// Define CSS as objects
const styles = css({
  '.container': {
    'max-width': '1200px',
    'margin': '0 auto',
    'padding': '20px',
    'background-color': 'var(--container-bg)',
  },
});

// Convert to CSS string
const cssString = toCSS(styles);
console.log(cssString);
```

Output:
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: var(--container-bg);
}
```

### Nested Selectors

```typescript
const styles = css({
  '.card': {
    'padding': '16px',
    'border-radius': '8px',
    
    // Nested selector
    '.card-title': {
      'font-size': '24px',
      'font-weight': 'bold',
    },
    
    // Using & for parent reference
    '&:hover': {
      'box-shadow': '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
});
```

Output:
```css
.card {
    padding: 16px;
    border-radius: 8px;
}

.card .card-title {
    font-size: 24px;
    font-weight: bold;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### Media Queries

```typescript
const styles = css({
  '.responsive': {
    'width': '100%',
    
    '@media (min-width: 768px)': {
      'width': '750px',
      'margin': '0 auto',
    },
    
    '@media (min-width: 1024px)': {
      'width': '960px',
    },
  },
});
```

### Minified Output

```typescript
const cssString = toCSS(styles, {
  minify: true,
  addNewlines: false,
});
```

### Custom Indentation

```typescript
const cssString = toCSS(styles, {
  indent: '  ', // 2 spaces instead of 4
});
```

## API

### `toCSS(css: CSSObject, options?: CSSGeneratorOptions): string`

Converts a CSS object to a CSS string.

**Parameters:**
- `css`: The CSS object to convert
- `options`: Optional configuration
  - `indent`: Indentation string (default: 4 spaces)
  - `minify`: Whether to minify output (default: false)
  - `addNewlines`: Whether to add newlines between rules (default: true)

**Returns:** CSS string

### `css(styles: CSSObject): CSSObject`

Helper function that provides TypeScript autocomplete support for CSS objects.

### `stylesheet(...styles: CSSObject[]): StylesheetReturn`

Creates a merged CSS object with a `toString()` method for flexible style composition.

This function is designed to be flexible in its input types, allowing for various ways to define styles. It can accept multiple CSS objects as separate arguments, a single array of CSS objects, or a single object containing multiple CSS rules. The function will merge all provided styles and return an object with both the merged `styles` property and a `toString()` method.

**Parameters:**
- `styles`: One or more CSS objects (as separate arguments, array, or single object)

**Returns:** Object with:
- `styles`: The merged CSSObject
- `toString()`: Method that returns the CSS string

**Examples:**

Multiple style objects as arguments:
```typescript
const sheet = stylesheet(
  { '.header': { background: 'white', padding: '10px' } },
  { '.container': { padding: '20px', margin: '0 auto' } }
);

console.log(sheet.toString());
// or access the merged styles object
console.log(sheet.styles);
```

Array of style objects:
```typescript
const styles = [
  { '.header': { background: 'white' } },
  { '.footer': { background: 'black' } }
];

const sheet = stylesheet(styles);
const cssString = sheet.toString();
```

Single object with multiple rules:
```typescript
const sheet = stylesheet({
  '.header': { 
    background: 'white',
    padding: '10px',
    '.title': {
      'font-size': '24px'
    }
  },
  '.footer': { 
    background: 'black' 
  }
});
```

Merging overlapping selectors:
```typescript
const sheet = stylesheet(
  { '.button': { color: 'red', padding: '10px' } },
  { '.button': { color: 'blue' } } // color will be overridden
);
// Result: .button will have color: blue and padding: 10px
```

## License

MIT
