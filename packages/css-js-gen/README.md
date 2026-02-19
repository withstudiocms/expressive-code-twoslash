# CSS-JS-Gen

[![NPM Version](https://img.shields.io/npm/v/css-js-gen)](https://npm.im/css-js-gen)

A TypeScript package that converts CSS object notation to CSS strings, providing a more maintainable alternative to template literals for generating CSS that needs to be inlined or exported as strings.

## Features

- ✅ **Type-safe CSS objects** - Full TypeScript support with autocomplete
- ✅ **Nested selectors** - Support for nested CSS rules with `&` parent selector
- ✅ **Media queries** - Built-in support for `@media` and other at-rules
- ✅ **Clean output** - Properly formatted and indented CSS strings
- ✅ **Zero dependencies** - Lightweight and fast

## Installation

```bash
pnpm install
pnpm build
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

## License

MIT
