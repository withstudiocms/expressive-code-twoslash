/** biome-ignore-all lint/style/noNonNullAssertion: This is fine for tests */

import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { createTwoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

const twoslasher = createTwoslasher();

describe(parentSuiteName, () => {
	it("works in a trivial case", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("works in a trivial case");

		const file = `
const a = "123"
//    ^?
  `;
		const result = twoslasher(file, "ts");
		const bQueryResult = result.queries.find((info) => info.line === 1);

		expect(bQueryResult).toBeTruthy();
		expect(bQueryResult!.text).toContain("const a");
	});

	it("supports carets in the middle of an identifier", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("supports carets in the middle of an identifier");

		const file = `
const abc = "123"
//     ^?
  `;
		const result = twoslasher(file, "ts");
		const bQueryResult = result.queries.find((info) => info.line === 1);
		expect(bQueryResult!.text).toContain("const abc");
	});

	it("supports two queries", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("supports two queries");

		const file = `
const a = "123"
//    ^?
const b = "345"
//    ^?
  `;
		const result = twoslasher(file, "ts");

		const aQueryResult = result.queries.find((info) => info.line === 1);
		expect(aQueryResult!.text).toContain("const a:");

		const bQueryResult = result.queries.find((info) => info.line === 2);
		expect(bQueryResult!.text).toContain("const b:");
	});

	it("supports many queries", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("supports many queries");

		const file = `
const a = "123"
//    ^?
const b = "345"
//    ^?
// A comment to throw things off
let c = "789"
//  ^? 
  `;
		const result = twoslasher(file, "ts");
		expect(result.queries.length).toEqual(3);

		const aQueryResult = result.queries.find((info) => info.line === 1);
		expect(aQueryResult!.text).toContain("const a:");

		const bQueryResult = result.queries.find((info) => info.line === 2);
		expect(bQueryResult!.text).toContain("const b:");

		const cQueryResult = result.queries.find((info) => info.line === 4);
		expect(cQueryResult!.text).toContain("let c:");
	});

	it("supports queries across many files", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("supports queries across many files");

		const file = `
// @filename: index.ts
const a = "123"
//    ^?
// @filename: main-file-queries.ts
const b = "345"
//    ^? 
  `;
		const result = twoslasher(file, "ts");

		const aQueryResult = result.queries.find((info) => info.line === 2);
		expect(aQueryResult!.text).toContain("const a:");

		const bQueryResult = result.queries.find((info) => info.line === 4);
		expect(bQueryResult!.text).toContain("const b:");
	});

	it("supports carets should be relative to token", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("queries");
		await allure.subSuite("supports carets should be relative to token");

		const file1 = `
const abc = "123"
//     ^?
  `;
		const file2 = `
const abc = "123"
//    ^?
  `;

		const result1 = twoslasher(file1, "ts");
		const result2 = twoslasher(file2, "ts");
		expect(result1.queries).toEqual(result2.queries);
	});
});
