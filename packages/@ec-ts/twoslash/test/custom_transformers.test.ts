import * as allure from "allure-js-commons";
import type { Node, SourceFile, TransformationContext, TransformerFactory } from "typescript";
import { isSourceFile, isStringLiteral, visitEachChild, visitNode } from "typescript";
import { describe, expect, it } from "vitest";
import { twoslasher } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	it("applies custom transformers", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("custom transformers");
		await allure.subSuite("basic transformer");

		const code = "console.log('Hello World!')";
		// A simple transformer that uppercases all string literals

		const transformer: TransformerFactory<SourceFile> = (ctx: TransformationContext) => {
			const visitor = (node: Node): Node => {
				if (isStringLiteral(node)) return ctx.factory.createStringLiteral(node.text.toUpperCase());
				return visitEachChild(node, visitor, ctx);
			};
			return (node) => visitNode(node, visitor, isSourceFile);
		};

		const result = twoslasher(code, "ts", {
			handbookOptions: { showEmit: true },
			customTransformers: {
				before: [transformer],
			},
		});
		expect(result.errors).toEqual([]);
		expect(result.code).toContain('console.log("HELLO WORLD!")');
	});
});
