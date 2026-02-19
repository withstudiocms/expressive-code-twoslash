import type {
	CSSGeneratorOptions,
	CSSObject,
	CSSProperties,
	CSSRule,
	CSSValue,
	StylesheetReturn,
} from "./types.ts";

/**
 * Check if a value is a plain CSS property value
 */
function isCSSValue(value: unknown): value is CSSValue {
	return typeof value === "string" || typeof value === "number";
}

/**
 * CSS properties that should not have units added to numeric values
 */
const UNITLESS_PROPERTIES = new Set([
	"z-index",
	"opacity",
	"font-weight",
	"line-height",
	"flex",
	"flex-grow",
	"flex-shrink",
	"order",
	"column-count",
	"fill-opacity",
	"stroke-opacity",
	"stop-opacity",
]);

/**
 * Format a CSS property name and value
 */
function formatProperty(property: string, value: CSSValue): string {
	let formattedValue: string | number = value;

	if (typeof value === "number" && value !== 0) {
		// Only add 'px' if the property is not unitless
		formattedValue = UNITLESS_PROPERTIES.has(property) ? value : `${value}px`;
	}

	return `${property}: ${formattedValue};`;
}

/**
 * Generate CSS properties string
 */
function generateProperties(
	properties: CSSProperties,
	indent: string,
	level: number,
	options: Required<CSSGeneratorOptions>,
): string {
	const indentation = options.minify ? "" : indent.repeat(level);
	const newline = options.minify ? "" : "\n";

	const props = Object.entries(properties)
		.filter(([, value]) => isCSSValue(value))
		.map(([prop, value]) => `${indentation}${formatProperty(prop, value as CSSValue)}`)
		.join(newline);

	return props;
}

/**
 * Generate CSS rules recursively
 */
function generateRule(
	selector: string,
	rule: CSSRule | CSSProperties,
	indent: string,
	level: number,
	options: Required<CSSGeneratorOptions>,
	parentSelector = "",
): string {
	const indentation = options.minify ? "" : indent.repeat(level);
	const newline = options.minify ? "" : "\n";
	const space = options.minify ? "" : " ";
	const ruleNewline = options.minify || !options.addNewlines ? "" : "\n";

	// Resolve the full selector
	let fullSelector = selector;
	if (parentSelector) {
		// If parent is an at-rule, don't concatenate it into the selector
		if (parentSelector.startsWith("@")) {
			fullSelector = selector;
		} else if (selector.includes("&")) {
			fullSelector = selector.replace(/&/g, parentSelector);
		} else if (selector.startsWith("@")) {
			// Media query or other at-rule
			fullSelector = selector;
		} else {
			fullSelector = `${parentSelector} ${selector}`;
		}
	}

	// Separate properties from nested selectors
	const properties: CSSProperties = {};
	const nestedRules: Record<string, CSSRule | CSSProperties> = {};

	for (const [key, value] of Object.entries(rule)) {
		if (isCSSValue(value)) {
			properties[key] = value;
		} else {
			// Non-CSS values are treated as nested rules
			nestedRules[key] = value as CSSRule | CSSProperties;
		}
	}

	let result = "";

	// Check if this is an at-rule (like @media) with nested content
	const isAtRule = fullSelector.startsWith("@");
	const hasNestedRules = Object.keys(nestedRules).length > 0;
	const hasProperties = Object.keys(properties).length > 0;

	// If this is an at-rule with nested content, wrap everything
	if (isAtRule && hasNestedRules) {
		result += `${indentation}${fullSelector}${space}{${newline}`;

		// Generate properties if any (within the at-rule)
		if (hasProperties) {
			const propsString = generateProperties(properties, indent, level + 1, options);
			result += propsString;
			result += newline;
		}

		// Generate nested rules within the at-rule
		for (const [nestedSelector, nestedRule] of Object.entries(nestedRules)) {
			result += generateRule(
				nestedSelector,
				nestedRule,
				indent,
				level + 1,
				options,
				"", // Don't pass the at-rule as parent selector
			);
		}

		result += `${indentation}}${ruleNewline}`;
	} else {
		// Normal selector (not an at-rule wrapping nested content)

		// Generate properties for this selector if any
		if (hasProperties) {
			const propsString = generateProperties(properties, indent, level + 1, options);
			result += `${indentation}${fullSelector}${space}{${newline}`;
			result += propsString;
			result += `${newline}${indentation}}${ruleNewline}`;
		}

		// Generate nested rules
		for (const [nestedSelector, nestedRule] of Object.entries(nestedRules)) {
			// Handle media queries and at-rules specially
			if (nestedSelector.startsWith("@")) {
				result += `${indentation}${nestedSelector}${space}{${newline}`;

				// For at-rules, we need to process the content with the original selector context
				const atRuleContent: CSSProperties = {};
				const nestedInAtRule: Record<string, CSSRule | CSSProperties> = {};

				for (const [key, value] of Object.entries(nestedRule)) {
					if (isCSSValue(value)) {
						atRuleContent[key] = value;
					} else {
						nestedInAtRule[key] = value as CSSRule | CSSProperties;
					}
				}

				// If there are direct properties, wrap them with the parent selector
				if (Object.keys(atRuleContent).length > 0) {
					const propsString = generateProperties(atRuleContent, indent, level + 2, options);
					result += `${indent.repeat(level + 1)}${fullSelector}${space}{${newline}`;
					result += propsString;
					result += `${newline}${indent.repeat(level + 1)}}${newline}`;
				}

				// Process nested selectors within the at-rule
				for (const [innerSelector, innerRule] of Object.entries(nestedInAtRule)) {
					result += generateRule(
						innerSelector,
						innerRule,
						indent,
						level + 1,
						options,
						fullSelector,
					);
				}

				result += `${indentation}}${ruleNewline}`;
			} else {
				result += generateRule(nestedSelector, nestedRule, indent, level, options, fullSelector);
			}
		}
	}

	return result;
}

/**
 * Convert a CSS object to a CSS string
 * @param css - The CSS object to convert
 * @param options - Options for CSS generation
 * @returns The generated CSS string
 *
 * @example
 * ```typescript
 * const css = toCSS({
 *   '.container': {
 *     'max-width': '1200px',
 *     'margin': '0 auto',
 *     '.title': {
 *       'font-size': '24px',
 *       'color': 'var(--primary-color)',
 *     }
 *   }
 * });
 * ```
 */
export function toCSS(css: CSSObject, options: CSSGeneratorOptions = {}): string {
	const opts: Required<CSSGeneratorOptions> = {
		indent: options.indent ?? "    ",
		minify: options.minify ?? false,
		addNewlines: options.addNewlines ?? true,
	};

	let result = "";

	for (const [selector, rule] of Object.entries(css)) {
		result += generateRule(selector, rule, opts.indent, 0, opts);
	}

	return result.trim();
}

/**
 * Create a CSS object with TypeScript autocomplete support
 * This is a helper function that provides better IDE support
 */
export function css(styles: CSSObject): CSSObject {
	return styles;
}

/**
 * Create a CSS string from a CSS object with TypeScript autocomplete support
 *
 * This function is designed to be flexible in its input types, allowing for various ways to define styles. It can accept multiple CSS objects as separate arguments, a single array of CSS objects, or a single object containing multiple CSS rules. The function will merge all provided styles into a single CSS string.
 *
 * @param styles - One or more CSS objects, which can be provided as separate arguments, a single array, or a single object containing multiple rules.
 * @returns An object containing the merged CSS styles and a `toString` method to get the CSS string representation.
 *
 * @example Get the merged CSS string from multiple style objects:
 * ```typescript
 * const cssString = stylesheet(
 *   { '.header': { background: 'white' } },
 *   { '.container': { padding: '10px' } },
 * ).toString();
 * ```
 *
 * @example Get the CSS string from an array of style objects:
 * ```typescript
 * const cssObject = stylesheet([
 *   { '.header': { background: 'white' } },
 *   { '.container': { padding: '10px' } },
 * ]).toString();
 * ```
 *
 * @example Get the CSS string from a single object containing multiple rules:
 * ```typescript
 * const cssObject = stylesheet({
 *   '.header': { background: 'white' },
 *   '.container': { padding: '10px' },
 * }).toString();
 * ```
 *
 * @example Merge multiple style objects with overlapping selectors:
 * ```typescript
 * const cssString = stylesheet(
 *   { '.button': { color: 'red' } },
 *   { '.button': { color: 'blue' }, '.link': { color: 'purple' } },
 * ).toString();
 * ```
 *
 * @example Merge multiple style objects with nested selectors:
 * ```typescript
 * const cssString = stylesheet(
 *   { '.container': { padding: '10px', '.item': { margin: '5px' } } },
 *   { '.container': { background: 'gray' }, '.item': { color: 'white' } },
 * ).toString();
 * ```
 *
 * @example Merge multiple styles and get the CSSObject:
 * ```typescript
 * const cssObject = stylesheet(
 *   { '.a': { color: 'red' } },
 *   { '.b': { color: 'blue' } },
 *   { '.c': { color: 'green' } },
 * );
 * console.log(cssObject.styles);
 * ```
 */
export function stylesheet(...styles: CSSObject[]): StylesheetReturn;
export function stylesheet(styles: CSSObject[]): StylesheetReturn;
export function stylesheet(styles: Record<string, CSSObject>): StylesheetReturn;
// biome-ignore lint/suspicious/noExplicitAny: This function is designed to be flexible in its input types, allowing for various ways to define styles. The use of 'any' here is intentional to accommodate the different input formats.
export function stylesheet(...args: any[]): StylesheetReturn {
	let cssObject: CSSObject = {};

	if (args.length === 1) {
		// If a single argument is provided, it can be either an array of styles or a single style object
		const firstArg = args[0];

		if (Array.isArray(firstArg)) {
			// If a single array argument is provided
			firstArg.forEach((style: CSSObject) => {
				cssObject = { ...cssObject, ...style };
			});
		} else if (typeof firstArg === "object") {
			// If a single object argument is provided
			cssObject = firstArg;
		}
	} else {
		// If multiple arguments are provided
		args.forEach((style: CSSObject) => {
			cssObject = { ...cssObject, ...style };
		});
	}

	return {
		styles: cssObject,
		toString: (options?: CSSGeneratorOptions) => toCSS(cssObject, options),
	};
}

// Re-export types
export type {
	CSSGeneratorOptions,
	CSSObject,
	CSSProperties,
	CSSRule,
	CSSValue,
} from "./types.ts";
