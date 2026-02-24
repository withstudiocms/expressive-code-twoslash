import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { createTwoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

const isWindows = process.platform === "win32";

const code = await import("./fixtures/query-basic.vue?raw").then((m) => m.default);

const twoslasher = createTwoslasher();

describe(parentSuiteName, () => {
	const result = twoslasher(code, "vue");

	it("has correct hover types", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Query Tests");
		await allure.subSuite("basic");

		expect(result.nodes.find((n) => n.type === "hover" && n.target === "button")).toHaveProperty(
			"text",
			"(property) button: ButtonHTMLAttributes & ReservedProps",
		);
		expect(result.nodes.find((n) => n.type === "hover" && n.target === "click")).toHaveProperty(
			"text",
			`(property) onClick?: ((payload: PointerEvent) => void) | undefined`,
		);
	});

	it("has correct query", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Query Tests");
		await allure.subSuite("basic");

		expect(result.nodes.find((n) => n.type === "query" && n.target === "double")).toHaveProperty(
			"text",
			"const double: ComputedRef<number>",
		);
		expect(result.nodes.filter((n) => n.type === "query")).toHaveLength(4);

		// Windows have different paths, result in different positions
		// We skip the following position tests on Windows
		if (isWindows) return;

		expect(result.meta.positionQueries).toMatchInlineSnapshot(`
        [
          292,
          360,
          1214,
          1396,
        ]
      `);

		expect(
			result.nodes.find((n) => n.type === "query" && n.target === "computed"),
		).toMatchInlineSnapshot(`
        {
          "character": 14,
          "length": 8,
          "line": 1,
          "start": 39,
          "target": "computed",
          "text": "(alias) const computed: {
            <T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ComputedRef<T>;
            <T, S = T>(options: WritableComputedOptions<T, S>, debugOptions?: DebuggerOptions): WritableComputedRef<T, S>;
        }
        import computed",
          "type": "query",
        }
      `);

		expect(
			result.nodes.find((n) => n.type === "query" && n.target === "count"),
		).toMatchInlineSnapshot(`
        {
          "character": 18,
          "length": 5,
          "line": 9,
          "start": 228,
          "target": "count",
          "text": "(property) count: number",
          "type": "query",
        }
      `);

		expect(
			result.nodes.find((n) => n.type === "query" && n.target === "click"),
		).toMatchInlineSnapshot(`
        {
          "character": 11,
          "length": 5,
          "line": 8,
          "start": 163,
          "target": "click",
          "text": "(property) onClick?: ((payload: PointerEvent) => void) | undefined",
          "type": "query",
        }
      `);
	});
});
