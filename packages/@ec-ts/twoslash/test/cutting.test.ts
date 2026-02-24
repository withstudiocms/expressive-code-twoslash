/** biome-ignore-all lint/style/noNonNullAssertion: This is fine for tests */

import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	[
		{
			name: "supports hiding the example code",
			file: `
const a = "123"
// ---cut---
const b = "345"
`,
			lang: "ts",
			cases: [
				{
					name: "hides the right code",
					test: (result: ReturnType<typeof twoslasher>) => {
						// Has the right code shipped
						expect(result.code).not.toContain("const a");
						expect(result.code).toContain("const b");
					},
				},
				{
					name: "shows the right LSP results",
					test: (result: ReturnType<typeof twoslasher>) => {
						expect(result.hovers.find((info) => info.text.includes("const a"))).toBeUndefined();

						const bLSPResult = result.hovers.find((info) => info.text.includes("const b"));
						expect(bLSPResult).toBeTruthy();

						// b is one char long
						expect(bLSPResult!.length).toEqual(1);
						// Should be at char 6
						expect(bLSPResult!.start).toEqual(6);
					},
				},
			],
		},
		{
			name: "supports hiding the example code with multi-files",
			file: `
// @filename: main-file.ts
const a = "123"
// @filename: file-with-export.ts
// ---cut---
const b = "345"
`,
			lang: "ts",
			cases: [
				{
					name: "shows the right LSP results",
					test: (result: ReturnType<typeof twoslasher>) => {
						expect(result.hovers.find((info) => info.text.includes("const a"))).toBeUndefined();

						const bLSPResult = result.hovers.find((info) => info.text.includes("const b"));
						expect(bLSPResult).toBeTruthy();

						// b is one char long
						expect(bLSPResult!.length).toEqual(1);
						// Should be at char 6
						expect(bLSPResult!.start).toEqual(6);
					},
				},
			],
		},
		{
			name: "supports handling queries in cut code",
			file: `
const a = "123"
// ---cut---
const b = "345"
//    ^?
`,
			lang: "ts",
			cases: [
				{
					name: "shows the right query results",
					test: (result: ReturnType<typeof twoslasher>) => {
						const bLSPResult = result.queries.find((info) => info.line === 0);
						expect(bLSPResult).toBeTruthy();
						expect(bLSPResult!.text).toContain("const b:");
					},
				},
			],
		},
		{
			name: "supports handling queries in cut multi-file code",
			file: `
// @filename: index.ts
const a = "123"
// @filename: main-file-queries.ts
const b = "345"
// ---cut---
const c = "678"
//    ^?
`,
			lang: "ts",
			cases: [
				{
					name: "shows the right query results",
					test: (result: ReturnType<typeof twoslasher>) => {
						const bQueryResult = result.queries.find((info) => info.line === 0);
						expect(bQueryResult).toBeTruthy();
						expect(bQueryResult!.text).toContain("const c:");
					},
				},
			],
		},
		{
			name: "supports hiding after a line",
			file: `
const a = "123"
// ---cut-after---
const b = "345"
`,
			lang: "ts",
			cases: [
				{
					name: "hides the right code",
					test: (result: ReturnType<typeof twoslasher>) => {
						// Has the right code shipped
						expect(result.code).toContain("const a");
						expect(result.code).not.toContain("const b");
					},
				},
				{
					name: "shows the right LSP results",
					test: (result: ReturnType<typeof twoslasher>) => {
						expect(result.hovers.find((info) => info.text.includes("const b"))).toBeUndefined();

						const bLSPResult = result.hovers.find((info) => info.text.includes("const a"));
						expect(bLSPResult).toBeTruthy();

						// b is one char long
						expect(bLSPResult!.length).toEqual(1);
						// Should be at char 7
						expect(bLSPResult!.start).toEqual(7);
					},
				},
			],
		},
		{
			name: "supports carriage return (1)",
			file: `const x = "123"\n\n// ---cut---\nconst b = "345"`,
			lang: "ts",
			cases: [
				{
					name: "hover is on the same line",
					test: (result: ReturnType<typeof twoslasher>) => {
						const hover = result.hovers.find((info) => info.text.includes("const b"));
						expect(hover?.line).toEqual(0);
					},
				},
			],
		},
		{
			name: "supports carriage return (2)",
			file: `const x = "123"\r\n\r\n// ---cut---\r\nconst b = "345"`,
			lang: "ts",
			cases: [
				{
					name: "hover is on the same line",
					test: (result: ReturnType<typeof twoslasher>) => {
						const hover = result.hovers.find((info) => info.text.includes("const b"));
						expect(hover?.line).toEqual(0);
					},
				},
			],
		},
		{
			name: "supports space before cut comments (1)",
			file: `function foo() {\n  const x = "123"\n// ---cut-start---\n  /** @type {"345"} */\n// ---cut-end---\n  const b = "345"\n}`,
			lang: "ts",
			cases: [
				{
					name: "hover is on the same line",
					test: (result: ReturnType<typeof twoslasher>) => {
						const hover = result.hovers.find((info) => info.text.includes("const b"));
						expect(hover?.line).toEqual(2);
					},
				},
			],
		},
		{
			name: "supports space before cut comments (2)",
			file: `function foo() {\n  const x = "123"\n  // ---cut-start---\n  /** @type {"345"} */\n  // ---cut-end---\n  const b = "345"\n}`,
			lang: "ts",
			cases: [
				{
					name: "hover is on the same line",
					test: (result: ReturnType<typeof twoslasher>) => {
						const hover = result.hovers.find((info) => info.text.includes("const b"));
						expect(hover?.line).toEqual(2);
					},
				},
			],
		},
		{
			name: "supports cut comments at end of file",
			file: `const x = "123"\n// ---cut-start---\n  /** @type {"345"} */\n// ---cut-end---`,
			lang: "ts",
			cases: [
				{
					name: "works without error",
					test: (result: ReturnType<typeof twoslasher>) => {
						expect(result.errors).toEqual([]);
					},
				},
			],
		},
	].forEach(({ name, file, lang, cases }) => {
		it(name, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("cutting");
			await allure.subSuite(name);

			const result = twoslasher(file, lang);

			for (const { name, test } of cases) {
				await allure.step(name, async () => {
					test(result);
				});
			}
		});
	});
});
