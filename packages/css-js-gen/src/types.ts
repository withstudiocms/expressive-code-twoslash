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

/**
 * Generate CSS properties string from a CSSProperties object
 */
export interface StylesheetReturn {
	/**
	 * The merged CSS object containing all styles provided to the stylesheet function, ready for conversion to a CSS string
	 */
	styles: CSSObject;

	/**
	 * Convert the CSS object to a CSS string with optional formatting options
	 * @param options - CSS generation options
	 * @returns A string representation of the CSS
	 */
	toString: (options?: CSSGeneratorOptions) => string;
}
