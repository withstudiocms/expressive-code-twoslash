/**
 * CSS property values can be strings, numbers, or CSS variable references
 */
export type CSSValue = string | number;

/**
 * Standard CSS properties with kebab-case notation
 */
export type CSSProperties = {
	[property: string]: CSSValue;
};

/**
 * A CSS rule can contain properties and nested selectors
 */
export interface CSSRule {
	[key: string]: CSSValue | CSSRule | CSSProperties;
}

/**
 * CSS object structure supporting nested selectors and media queries
 */
export interface CSSObject {
	[selector: string]: CSSRule | CSSProperties;
}

/**
 * Options for CSS generation
 */
export interface CSSGeneratorOptions {
	/**
	 * Indentation string (default: 4 spaces)
	 */
	indent?: string;

	/**
	 * Whether to minify the output (default: false)
	 */
	minify?: boolean;

	/**
	 * Whether to add newlines between rules (default: true)
	 */
	addNewlines?: boolean;
}
