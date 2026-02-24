/** biome-ignore-all lint/style/noNonNullAssertion: This is fine for tests */

import * as allure from "allure-js-commons";
import { ModuleKind } from "typescript";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	it("emits CommonJS", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("compiler options");
		await allure.subSuite("module options");

		const files = `
// @filename: file-with-export.ts
export const helloWorld = "Example string";

// @filename: index.ts
import {helloWorld} from "./file-with-export"
console.log(helloWorld)
`;
		const result = twoslasher(files, "ts", {
			handbookOptions: { showEmit: true },
			compilerOptions: { module: ModuleKind.CommonJS },
		});
		expect(result.errors).toEqual([]);
		expect(result.code!).toContain('require("./file-with-export")');
	});

	it("supports space before @filename", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("compiler options");
		await allure.subSuite("module options");

		const files = `
  // @filename: file-with-export.ts
export const helloWorld = "Example string";

  // @filename: index.ts
import {helloWorld} from "./file-with-export"
console.log(helloWorld)
`;
		const result = twoslasher(files, "ts", {
			handbookOptions: { showEmit: true },
			compilerOptions: { module: ModuleKind.CommonJS },
		});
		expect(result.errors).toEqual([]);
		expect(result.code!).toContain('require("./file-with-export")');
	});
});
