/** biome-ignore-all lint/suspicious/noExplicitAny: Using any for test flexibility */
import * as allure from "allure-js-commons";
import { describe, expect, test } from "vitest";
import { css, stylesheet, toCSS } from "../src/index.ts";

const parentSuiteName = "css-js-gen Tests";

describe(parentSuiteName, () => {
	// css helper function tests
	[
		{
			name: "should return the CSS object unchanged",
			input: {
				".button": {
					background: "blue",
					color: "white",
				},
			},
			validate: (result: Record<string, any>) => {
				expect(result).toEqual({
					".button": {
						background: "blue",
						color: "white",
					},
				});
			},
		},
		{
			name: "should provide TypeScript type checking",
			input: {
				".test": {
					display: "flex",
					"flex-direction": "row",
				},
			},
			validate: (result: Record<string, any>) => {
				expect(result).toHaveProperty(".test");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`css helper function - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("css helper function");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: Record<string, any> = {};

			await allure.step("Process CSS object with css helper function", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = css(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", JSON.stringify(result, null, 2));
				validate(result);
			});
		});
	});

	// toCSS tests

	// Basic functionality tests
	[
		{
			name: "should convert simple CSS properties to a CSS string",
			input: {
				".container": {
					"max-width": "1200px",
					margin: "0 auto",
				},
			},
			validate: (result: string) => {
				expect(result).toBe(
					`.container {
    max-width: 1200px;
    margin: 0 auto;
}`,
				);
			},
		},
		{
			name: "should handle numeric values with px units",
			input: {
				".box": {
					width: 300,
					height: 200,
					padding: 20,
				},
			},
			validate: (result: string) => {
				expect(result).toContain("width: 300px;");
				expect(result).toContain("height: 200px;");
				expect(result).toContain("padding: 20px;");
			},
		},
		{
			name: "should handle zero without units",
			input: {
				".element": {
					margin: 0,
					padding: 0,
				},
			},
			validate: (result: string) => {
				expect(result).toContain("margin: 0;");
				expect(result).toContain("padding: 0;");
			},
		},
		{
			name: "should not add units to unitless properties",
			input: {
				".element": {
					"z-index": 10,
					opacity: 0.5,
					"font-weight": 700,
					"line-height": 1.5,
					flex: 1,
					"flex-grow": 2,
					"flex-shrink": 1,
					order: 3,
				},
			},
			validate: (result: string) => {
				expect(result).toContain("z-index: 10;");
				expect(result).toContain("opacity: 0.5;");
				expect(result).toContain("font-weight: 700;");
				expect(result).toContain("line-height: 1.5;");
				expect(result).toContain("flex: 1;");
				expect(result).toContain("flex-grow: 2;");
				expect(result).toContain("flex-shrink: 1;");
				expect(result).toContain("order: 3;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - basic functionality - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("basic functionality");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = toCSS(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// Nested selectors tests
	[
		{
			name: "should handle nested selectors",
			input: {
				".container": {
					"max-width": "1200px",
					".title": {
						"font-size": "24px",
						color: "blue",
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".container {");
				expect(result).toContain("max-width: 1200px;");
				expect(result).toContain(".container .title {");
				expect(result).toContain("font-size: 24px;");
				expect(result).toContain("color: blue;");
			},
		},
		{
			name: "should handle ampersand (&) parent selector",
			input: {
				".button": {
					background: "blue",
					"&:hover": {
						background: "darkblue",
					},
					"&.active": {
						background: "green",
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".button {");
				expect(result).toContain("background: blue;");
				expect(result).toContain(".button:hover {");
				expect(result).toContain("background: darkblue;");
				expect(result).toContain(".button.active {");
				expect(result).toContain("background: green;");
			},
		},
		{
			name: "should handle deeply nested selectors",
			input: {
				".nav": {
					display: "flex",
					".menu": {
						"list-style": "none",
						".item": {
							padding: "10px",
						},
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".nav {");
				expect(result).toContain(".nav .menu {");
				expect(result).toContain(".nav .menu .item {");
				expect(result).toContain("padding: 10px;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - nested selectors - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("nested selectors");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = toCSS(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// media queries and at-rules tests
	[
		{
			name: "should handle media queries",
			input: {
				".container": {
					width: "100%",
					"@media (min-width: 768px)": {
						width: "750px",
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".container {");
				expect(result).toContain("width: 100%;");
				expect(result).toContain("@media (min-width: 768px) {");
				expect(result).toContain(".container {");
				expect(result).toContain("width: 750px;");
			},
		},
		{
			name: "should handle media queries with nested selectors",
			input: {
				".container": {
					padding: "10px",
					"@media (min-width: 768px)": {
						padding: "20px",
						".title": {
							"font-size": "32px",
						},
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain("@media (min-width: 768px) {");
				expect(result).toContain(".container {");
				expect(result).toContain("padding: 20px;");
				expect(result).toContain(".container .title {");
				expect(result).toContain("font-size: 32px;");
			},
		},
		{
			name: "should handle keyframes",
			input: {
				"@keyframes fadeIn": {
					"0%": {
						opacity: 0,
					},
					"100%": {
						opacity: 1,
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain("@keyframes fadeIn {");
				expect(result).toContain("0% {");
				expect(result).toContain("opacity: 0;");
				expect(result).toContain("100% {");
				expect(result).toContain("opacity: 1;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - media queries and at-rules - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("media queries and at-rules");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = toCSS(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// formatting options tests
	[
		{
			name: "should minify output when minify option is true",
			input: {
				".container": {
					"max-width": "1200px",
					margin: "0 auto",
				},
			},
			options: { minify: true },
			validate: (result: string) => {
				expect(result).toBe(".container{max-width: 1200px;margin: 0 auto;}");
			},
		},
		{
			name: "should use custom indentation",
			input: {
				".container": {
					padding: "10px",
				},
			},
			options: { indent: "  " },
			validate: (result: string) => {
				expect(result).toContain("  padding: 10px;");
			},
		},
		{
			name: "should respect addNewlines option",
			input: {
				".box1": {
					width: "100px",
				},
				".box2": {
					height: "100px",
				},
			},
			options: { addNewlines: false },
			validate: (result: string) => {
				// Without newlines between rules, they should be adjacent
				expect(result).toContain("}.box2");
			},
		},
		{
			name: "should handle minified nested selectors",
			input: {
				".parent": {
					display: "block",
					".child": {
						display: "inline",
					},
				},
			},
			options: { minify: true },
			validate: (result: string) => {
				expect(result).toBe(".parent{display: block;}.parent .child{display: inline;}");
			},
		},
	].forEach(({ name, input, options, validate }) => {
		test(`toCSS - formatting options - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("formatting options");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object with options", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				await ctx.parameter("options", JSON.stringify(options, null, 2));
				result = toCSS(input, options);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// complex scenarios tests
	[
		{
			name: "should handle multiple top-level selectors",
			input: {
				".header": {
					background: "white",
				},
				".footer": {
					background: "black",
				},
				".main": {
					background: "gray",
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".header {");
				expect(result).toContain(".footer {");
				expect(result).toContain(".main {");
			},
		},
		{
			name: "should handle CSS variables",
			input: {
				":root": {
					"--primary-color": "blue",
					"--spacing": "16px",
				},
				".button": {
					color: "var(--primary-color)",
					padding: "var(--spacing)",
				},
			},
			validate: (result: string) => {
				expect(result).toContain("--primary-color: blue;");
				expect(result).toContain("color: var(--primary-color);");
			},
		},
		{
			name: "should handle pseudo-classes and pseudo-elements",
			input: {
				".link": {
					color: "blue",
					"&:hover": {
						color: "darkblue",
					},
					"&::before": {
						content: '"→"',
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".link {");
				expect(result).toContain("color: blue;");
				expect(result).toContain(".link:hover {");
				expect(result).toContain("color: darkblue;");
				expect(result).toContain(".link::before {");
				expect(result).toContain('content: "→";');
			},
		},
		{
			name: "should handle complex nested media queries",
			input: {
				".nav": {
					display: "block",
					".item": {
						padding: "5px",
						"@media (min-width: 768px)": {
							padding: "10px",
						},
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".nav {");
				expect(result).toContain(".nav .item {");
				expect(result).toContain("@media (min-width: 768px) {");
				expect(result).toContain(".nav .item {");
				expect(result).toContain("padding: 10px;");
			},
		},
		{
			name: "should handle complex selectors with combinators and attribute selectors",
			input: {
				'input[type="text"]': {
					border: "1px solid gray",
				},
				".parent > .child": {
					margin: "0",
				},
			},
			validate: (result: string) => {
				expect(result).toContain('input[type="text"] {');
				expect(result).toContain("border: 1px solid gray;");
				expect(result).toContain(".parent > .child {");
				expect(result).toContain("margin: 0;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - complex scenarios - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("complex scenarios");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = toCSS(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// edge cases tests
	[
		{
			name: "should handle empty objects gracefully",
			input: {},
			validate: (result: string) => {
				expect(result).toBe("");
			},
		},
		{
			name: "should handle selectors with no properties",
			input: {
				".empty": {},
			},
			validate: (result: string) => {
				expect(result).toBe("");
			},
		},
		{
			name: "should handle string numeric values",
			input: {
				".element": {
					width: "100%",
					height: "50vh",
					margin: "10px 20px",
				},
			},
			validate: (result: string) => {
				expect(result).toContain("width: 100%;");
				expect(result).toContain("height: 50vh;");
				expect(result).toContain("margin: 10px 20px;");
			},
		},
		{
			name: "should handle multiple selectors separated by comma",
			input: {
				"h1, h2, h3": {
					"font-family": "Arial",
					"font-weight": "bold",
				},
			},
			validate: (result: string) => {
				expect(result).toContain("h1, h2, h3 {");
				expect(result).toContain("font-family: Arial;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - edge cases - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("edge cases");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input object", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = toCSS(input);
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// toCSS camelCase conversion tests
	[
		{
			name: "should convert camelCase properties to kebab-case",
			input: {
				".element": {
					backgroundColor: "red",
					fontSize: "16px",
					marginTop: 10,
				},
			},
			validate: (result: string) => {
				expect(result).toContain("background-color: red;");
				expect(result).toContain("font-size: 16px;");
				expect(result).toContain("margin-top: 10px;");
			},
		},
		{
			name: "should handle vendor prefixed properties in camelCase",
			input: {
				".element": {
					WebkitTransform: "scale(1.1)",
					MozAppearance: "none",
					msFlexDirection: "column",
				},
			},
			validate: (result: string) => {
				expect(result).toContain("-webkit-transform: scale(1.1);");
				expect(result).toContain("-moz-appearance: none;");
				expect(result).toContain("-ms-flex-direction: column;");
			},
		},
		{
			name: "should handle mixed camelCase and kebab-case properties",
			input: {
				".element": {
					backgroundColor: "red",
					"font-size": "16px",
					marginTop: 10,
					"padding-bottom": 20,
				},
			},
			validate: (result: string) => {
				expect(result).toContain("background-color: red;");
				expect(result).toContain("font-size: 16px;");
				expect(result).toContain("margin-top: 10px;");
				expect(result).toContain("padding-bottom: 20px;");
			},
		},
		{
			name: "should handle nested selectors with camelCase properties",
			input: {
				".container": {
					maxWidth: "1200px",
					".item": {
						backgroundColor: "gray",
						"&:hover": {
							backgroundColor: "darkgray",
						},
					},
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".container {");
				expect(result).toContain("max-width: 1200px;");
				expect(result).toContain(".container .item {");
				expect(result).toContain("background-color: gray;");
				expect(result).toContain(".container .item:hover {");
				expect(result).toContain("background-color: darkgray;");
			},
		},
		{
			name: "should handle CSS.Properties-like objects with camelCase",
			input: {
				".element": {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-between",
				},
			},
			validate: (result: string) => {
				expect(result).toContain("display: flex;");
				expect(result).toContain("flex-direction: column;");
				expect(result).toContain("align-items: center;");
				expect(result).toContain("justify-content: space-between;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`toCSS - camelCase conversion - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("toCSS");
			await allure.subSuite("camelCase conversion");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step(
				"Generate CSS string from input object with camelCase properties",
				async (ctx) => {
					await ctx.parameter("input", JSON.stringify(input, null, 2));
					result = toCSS(input);
				},
			);

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});

	// stylesheet function tests
	[
		{
			name: "should handle multiple CSS objects as separate arguments",
			input: [
				{
					".header": {
						background: "white",
					},
				},
				{
					".footer": {
						background: "black",
					},
				},
			],
			validate: (result: string) => {
				expect(result).toContain(".header {");
				expect(result).toContain("background: white;");
				expect(result).toContain(".footer {");
				expect(result).toContain("background: black;");
			},
		},
		{
			name: "should handle array of CSS objects",
			input: [
				{
					".container": {
						padding: "10px",
					},
				},
				{
					".box": {
						margin: "5px",
					},
				},
			],
			validate: (result: string) => {
				expect(result).toContain(".container {");
				expect(result).toContain("padding: 10px;");
				expect(result).toContain(".box {");
				expect(result).toContain("margin: 5px;");
			},
		},
		{
			name: "should handle single record object",
			input: {
				".button": {
					background: "blue",
					color: "white",
				},
				".link": {
					color: "purple",
				},
			},
			validate: (result: string) => {
				expect(result).toContain(".button {");
				expect(result).toContain(".link {");
			},
		},
		{
			name: "should merge multiple style objects correctly",
			input: [
				{ ".a": { color: "red" } },
				{ ".b": { color: "blue" } },
				{ ".c": { color: "green" } },
			],
			validate: (result: string) => {
				expect(result).toContain(".a {");
				expect(result).toContain(".b {");
				expect(result).toContain(".c {");
			},
		},
		{
			name: "should handle empty array",
			input: [],
			validate: (result: string) => {
				expect(result).toBe("");
			},
		},
		{
			name: "should handle empty record object",
			input: {},
			validate: (result: string) => {
				expect(result).toBe("");
			},
		},
		{
			name: "should override properties when merging objects",
			input: [{ ".element": { color: "red" } }, { ".element": { color: "blue" } }],
			validate: (result: string) => {
				expect(result).toContain("color: blue;");
			},
		},
	].forEach(({ name, input, validate }) => {
		test(`stylesheet function - ${name}`, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("stylesheet function");
			await allure.parameter("testCase", name);
			await allure.label("package", "css-js-gen");

			let result: string = "";

			await allure.step("Generate CSS string from input using stylesheet function", async (ctx) => {
				await ctx.parameter("input", JSON.stringify(input, null, 2));
				result = stylesheet(...(Array.isArray(input) ? input : [input])).toString();
			});

			await allure.step("Validate output", async (ctx) => {
				await ctx.parameter("output", result);
				validate(result);
			});
		});
	});
});
