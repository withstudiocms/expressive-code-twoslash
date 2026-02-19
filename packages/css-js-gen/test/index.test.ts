import { describe, expect, it } from "vitest";
import { css, stylesheet, toCSS } from "../src/index.ts";

describe("toCSS", () => {
	describe("basic functionality", () => {
		it("should convert simple CSS properties to a CSS string", () => {
			const result = toCSS({
				".container": {
					"max-width": "1200px",
					margin: "0 auto",
				},
			});

			expect(result).toBe(
				`.container {
    max-width: 1200px;
    margin: 0 auto;
}`,
			);
		});

		it("should handle numeric values with px units", () => {
			const result = toCSS({
				".box": {
					width: 300,
					height: 200,
					padding: 20,
				},
			});

			expect(result).toContain("width: 300px;");
			expect(result).toContain("height: 200px;");
			expect(result).toContain("padding: 20px;");
		});

		it("should handle zero without units", () => {
			const result = toCSS({
				".element": {
					margin: 0,
					padding: 0,
				},
			});

			expect(result).toContain("margin: 0;");
			expect(result).toContain("padding: 0;");
		});

		it("should not add units to unitless properties", () => {
			const result = toCSS({
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
			});

			expect(result).toContain("z-index: 10;");
			expect(result).toContain("opacity: 0.5;");
			expect(result).toContain("font-weight: 700;");
			expect(result).toContain("line-height: 1.5;");
			expect(result).toContain("flex: 1;");
			expect(result).toContain("flex-grow: 2;");
			expect(result).toContain("flex-shrink: 1;");
			expect(result).toContain("order: 3;");
		});
	});

	describe("nested selectors", () => {
		it("should handle nested selectors", () => {
			const result = toCSS({
				".container": {
					"max-width": "1200px",
					".title": {
						"font-size": "24px",
						color: "blue",
					},
				},
			});

			expect(result).toContain(".container {");
			expect(result).toContain("max-width: 1200px;");
			expect(result).toContain(".container .title {");
			expect(result).toContain("font-size: 24px;");
			expect(result).toContain("color: blue;");
		});

		it("should handle ampersand (&) parent selector", () => {
			const result = toCSS({
				".button": {
					background: "blue",
					"&:hover": {
						background: "darkblue",
					},
					"&.active": {
						background: "green",
					},
				},
			});

			expect(result).toContain(".button {");
			expect(result).toContain("background: blue;");
			expect(result).toContain(".button:hover {");
			expect(result).toContain("background: darkblue;");
			expect(result).toContain(".button.active {");
			expect(result).toContain("background: green;");
		});

		it("should handle deeply nested selectors", () => {
			const result = toCSS({
				".nav": {
					display: "flex",
					".menu": {
						"list-style": "none",
						".item": {
							padding: "10px",
						},
					},
				},
			});

			expect(result).toContain(".nav {");
			expect(result).toContain(".nav .menu {");
			expect(result).toContain(".nav .menu .item {");
			expect(result).toContain("padding: 10px;");
		});
	});

	describe("media queries and at-rules", () => {
		it("should handle media queries", () => {
			const result = toCSS({
				".container": {
					width: "100%",
					"@media (min-width: 768px)": {
						width: "750px",
					},
				},
			});

			expect(result).toContain(".container {");
			expect(result).toContain("width: 100%;");
			expect(result).toContain("@media (min-width: 768px) {");
			expect(result).toContain(".container {");
			expect(result).toContain("width: 750px;");
		});

		it("should handle media queries with nested selectors", () => {
			const result = toCSS({
				".container": {
					padding: "10px",
					"@media (min-width: 768px)": {
						padding: "20px",
						".title": {
							"font-size": "32px",
						},
					},
				},
			});

			expect(result).toContain("@media (min-width: 768px) {");
			expect(result).toContain(".container {");
			expect(result).toContain("padding: 20px;");
			expect(result).toContain(".container .title {");
			expect(result).toContain("font-size: 32px;");
		});

		it("should handle keyframes", () => {
			const result = toCSS({
				"@keyframes fadeIn": {
					"0%": {
						opacity: 0,
					},
					"100%": {
						opacity: 1,
					},
				},
			});

			expect(result).toContain("@keyframes fadeIn {");
			expect(result).toContain("0% {");
			expect(result).toContain("opacity: 0;");
			expect(result).toContain("100% {");
			expect(result).toContain("opacity: 1;");
		});
	});

	describe("formatting options", () => {
		it("should minify output when minify option is true", () => {
			const result = toCSS(
				{
					".container": {
						"max-width": "1200px",
						margin: "0 auto",
					},
				},
				{ minify: true },
			);

			expect(result).toBe(".container{max-width: 1200px;margin: 0 auto;}");
		});

		it("should use custom indentation", () => {
			const result = toCSS(
				{
					".container": {
						padding: "10px",
					},
				},
				{ indent: "  " },
			);

			expect(result).toContain("  padding: 10px;");
		});

		it("should respect addNewlines option", () => {
			const result = toCSS(
				{
					".box1": {
						width: "100px",
					},
					".box2": {
						height: "100px",
					},
				},
				{ addNewlines: false },
			);

			// Without newlines between rules, they should be adjacent
			expect(result).toContain("}.box2");
		});

		it("should handle minified nested selectors", () => {
			const result = toCSS(
				{
					".parent": {
						display: "block",
						".child": {
							display: "inline",
						},
					},
				},
				{ minify: true },
			);

			expect(result).toBe(".parent{display: block;}.parent .child{display: inline;}");
		});
	});

	describe("complex scenarios", () => {
		it("should handle multiple top-level selectors", () => {
			const result = toCSS({
				".header": {
					background: "white",
				},
				".footer": {
					background: "black",
				},
				".main": {
					background: "gray",
				},
			});

			expect(result).toContain(".header {");
			expect(result).toContain(".footer {");
			expect(result).toContain(".main {");
		});

		it("should handle CSS variables", () => {
			const result = toCSS({
				":root": {
					"--primary-color": "blue",
					"--spacing": "16px",
				},
				".button": {
					color: "var(--primary-color)",
					padding: "var(--spacing)",
				},
			});

			expect(result).toContain("--primary-color: blue;");
			expect(result).toContain("color: var(--primary-color);");
		});

		it("should handle pseudo-elements", () => {
			const result = toCSS({
				".link": {
					color: "blue",
					"&::before": {
						content: '"→"',
					},
					"&::after": {
						content: '"←"',
					},
				},
			});

			expect(result).toContain(".link::before {");
			expect(result).toContain(".link::after {");
		});

		it("should handle complex nested media queries", () => {
			const result = toCSS({
				".nav": {
					display: "block",
					".item": {
						padding: "5px",
						"@media (min-width: 768px)": {
							padding: "10px",
						},
					},
				},
			});

			expect(result).toContain(".nav {");
			expect(result).toContain(".nav .item {");
			expect(result).toContain("@media (min-width: 768px) {");
			expect(result).toContain(".nav .item {");
			expect(result).toContain("padding: 10px;");
		});

		it("should handle attribute selectors", () => {
			const result = toCSS({
				'input[type="text"]': {
					border: "1px solid gray",
				},
				'a[href^="https://"]': {
					color: "green",
				},
			});

			expect(result).toContain('input[type="text"] {');
			expect(result).toContain('a[href^="https://"] {');
		});

		it("should handle combinators", () => {
			const result = toCSS({
				".parent > .child": {
					margin: "0",
				},
				".sibling + .next": {
					"margin-top": "10px",
				},
				".element ~ .after": {
					opacity: 0.5,
				},
			});

			expect(result).toContain(".parent > .child {");
			expect(result).toContain(".sibling + .next {");
			expect(result).toContain(".element ~ .after {");
		});
	});

	describe("edge cases", () => {
		it("should handle empty objects gracefully", () => {
			const result = toCSS({});
			expect(result).toBe("");
		});

		it("should handle selectors with no properties", () => {
			const result = toCSS({
				".empty": {},
			});
			expect(result).toBe("");
		});

		it("should handle string numeric values", () => {
			const result = toCSS({
				".element": {
					width: "100%",
					height: "50vh",
					margin: "10px 20px",
				},
			});

			expect(result).toContain("width: 100%;");
			expect(result).toContain("height: 50vh;");
			expect(result).toContain("margin: 10px 20px;");
		});

		it("should handle multiple selectors separated by comma", () => {
			const result = toCSS({
				"h1, h2, h3": {
					"font-family": "Arial",
					"font-weight": "bold",
				},
			});

			expect(result).toContain("h1, h2, h3 {");
			expect(result).toContain("font-family: Arial;");
		});
	});
});

describe("css helper function", () => {
	it("should return the CSS object unchanged", () => {
		const styles = {
			".button": {
				background: "blue",
				color: "white",
			},
		};

		const result = css(styles);
		expect(result).toEqual(styles);
	});

	it("should provide TypeScript type checking", () => {
		// This test mainly validates that the function exists and works
		const result = css({
			".test": {
				display: "flex",
				"flex-direction": "row",
			},
		});

		expect(result).toHaveProperty(".test");
	});

	describe("stylesheet function", () => {
		it("should handle multiple CSS objects as separate arguments", () => {
			const result = stylesheet(
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
			);

			expect(result).toContain(".header {");
			expect(result).toContain("background: white;");
			expect(result).toContain(".footer {");
			expect(result).toContain("background: black;");
		});

		it("should handle array of CSS objects", () => {
			const result = stylesheet([
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
			]);

			expect(result).toContain(".container {");
			expect(result).toContain("padding: 10px;");
			expect(result).toContain(".box {");
			expect(result).toContain("margin: 5px;");
		});

		it("should handle single record object", () => {
			const result = stylesheet({
				".button": {
					background: "blue",
					color: "white",
				},
				".link": {
					color: "purple",
				},
			});

			expect(result).toContain(".button {");
			expect(result).toContain(".link {");
		});

		it("should merge multiple style objects correctly", () => {
			const result = stylesheet(
				{ ".a": { color: "red" } },
				{ ".b": { color: "blue" } },
				{ ".c": { color: "green" } },
			);

			expect(result).toContain(".a {");
			expect(result).toContain(".b {");
			expect(result).toContain(".c {");
		});

		it("should handle empty array", () => {
			const result = stylesheet([]);
			expect(result).toBe("");
		});

		it("should handle empty record object", () => {
			const result = stylesheet({});
			expect(result).toBe("");
		});

		it("should override properties when merging objects", () => {
			const result = stylesheet(
				{ ".element": { color: "red" } },
				{ ".element": { color: "blue" } },
			);

			expect(result).toContain("color: blue;");
		});
	});
});
