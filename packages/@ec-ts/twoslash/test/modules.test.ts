/** biome-ignore-all lint/style/noNonNullAssertion: This is fine for tests */
import { createDefaultMapFromNodeModules } from "@ec-ts/vfs";
import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

const dt = `
declare namespace G {
      function hasMagic(pattern: string, options?: IOptions): boolean;
}        
export = G;
`;

describe(parentSuiteName, () => {
	it("works with a dependency in @types for the project", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("works with a dependency in @types for the project");

		const fsMap = createDefaultMapFromNodeModules({});
		fsMap.set("/node_modules/@types/glob/index.d.ts", dt);

		const file = `
import glob from "glob"
glob.hasMagic("OK")
//   ^?
  `;
		const result = twoslasher(file, "ts", { fsMap });
		expect(result.errors).toEqual([]);
		expect(result.queries[0].text!.includes("hasMagic")).toBeTruthy();
	});
});
