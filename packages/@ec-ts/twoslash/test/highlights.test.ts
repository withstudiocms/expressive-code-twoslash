import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	it("supports highlighting something", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("highlights");
		await allure.subSuite("supports highlighting something");
		const file = `
const a = "123"
//    ^^^^^^^^^
const b = "345"
`;
		const result = twoslasher(file, "ts");
		expect(result.highlights.length).toEqual(1);
	});
});
