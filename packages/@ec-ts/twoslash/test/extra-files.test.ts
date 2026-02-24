import * as allure from "allure-js-commons";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	[
		{
			name: "prepends and appends extra files correctly",
			file: `
const a = ref(1)
    `.trim(),
			lang: "ts",
			extraFiles: {
				"index.ts": {
					prepend: "function ref<T>(value: T): Ref<T> { return { value } }\n",
					append: "\ninterface Ref<T> { value: T }",
				},
			},
			test: (result: ReturnType<typeof twoslasher>) => {
				expect(
					result.nodes.find((n) => n.type === "hover" && n.target === "ref"),
				).toMatchInlineSnapshot(`
        {
          "character": 10,
          "length": 3,
          "line": 0,
          "start": 10,
          "target": "ref",
          "text": "function ref<number>(value: number): Ref<number>",
          "type": "hover",
        }
      `);
			},
		},
		{
			name: "supports extra files",
			file: `
import { ref } from './foo'
const a = ref(1)
a.value = 'foo'
    `.trim(),
			lang: "ts",
			extraFiles: {
				"foo.ts":
					"export function ref<T>(value: T): Ref<T> { return { value } }\ninterface Ref<T> { value: string }",
			},
			test: (result: ReturnType<typeof twoslasher>) => {
				expect(
					result.nodes
						.slice()
						.reverse()
						.find((n) => n.type === "hover" && n.target === "ref"),
				).toMatchInlineSnapshot(`
        {
          "character": 10,
          "length": 3,
          "line": 1,
          "start": 38,
          "target": "ref",
          "text": "(alias) ref<number>(value: number): Ref<number>
        import ref",
          "type": "hover",
        }
      `);
			},
		},
	].forEach(({ name, file, lang, extraFiles, test }) => {
		it(name, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("extra files");
			await allure.subSuite(name);
			const result = twoslasher(file, lang, { extraFiles });
			expect(result.code).toEqual(file);
			test(result);
		});
	});
});
