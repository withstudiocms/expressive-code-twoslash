import path from "node:path";
import * as allure from "allure-js-commons";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { createFSBackedSystem, createVirtualTypeScriptEnvironment } from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	it("can use a FS backed system ", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("FS Backed System");
		await allure.subSuite("Basic Functionality");

		const compilerOpts: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES2016,
			esModuleInterop: true,
		};
		const fsMap = new Map<string, string>();

		const content = `/// <reference types="node" />\nimport * as path from 'path';\npath.`;
		fsMap.set("index.ts", content);

		const monorepoRoot = path.join(__dirname, "..", "..", "..");
		const system = createFSBackedSystem(fsMap, monorepoRoot, ts);
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);

		const completions = env.languageService.getCompletionsAtPosition(
			"index.ts",
			content.length,
			{},
		);
		const hasPathJoinFunc = completions?.entries.find((c) => c.name === "join");
		expect(hasPathJoinFunc).toBeTruthy();
	});

	it("can import files in the virtual fs", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("FS Backed System");
		await allure.subSuite("Basic Functionality");

		const compilerOpts: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES2016,
			esModuleInterop: true,
		};
		const fsMap = new Map<string, string>();

		const monorepoRoot = path.join(__dirname, "..", "..", "..");
		const fakeFolder = path.join(monorepoRoot, "fake");
		const exporter = path.join(fakeFolder, "file-with-export.ts");
		const index = path.join(fakeFolder, "index.ts");

		fsMap.set(exporter.replace(/\\/g, "/"), `export const helloWorld = "Example string";`);
		fsMap.set(
			index.replace(/\\/g, "/"),
			`import {helloWorld} from "./file-with-export"; console.log(helloWorld)`,
		);

		const system = createFSBackedSystem(fsMap, monorepoRoot, ts);
		const env = createVirtualTypeScriptEnvironment(system, [index, exporter], ts, compilerOpts);

		const errs: import("typescript").Diagnostic[] = [];
		errs.push(...env.languageService.getSemanticDiagnostics(index));
		errs.push(...env.languageService.getSyntacticDiagnostics(index));

		expect(errs.map((e) => e.messageText)).toEqual([]);
	});

	it("searches node_modules/@types", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("FS Backed System");
		await allure.subSuite("Basic Functionality");

		const compilerOpts: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES2016,
			esModuleInterop: true,
		};
		const monorepoRoot = __dirname;

		const fsMap = new Map<string, string>();
		fsMap.set("index.ts", "it('found vitest', () => undefined)");

		const system = createFSBackedSystem(fsMap, monorepoRoot, ts);
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);

		const semDiags = env.languageService.getSemanticDiagnostics("index.ts");
		console.log(semDiags.map((d) => d.messageText));
		expect(semDiags.length).toBe(0);
	});

	it("can delete files in the virtual fs", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("FS Backed System");
		await allure.subSuite("Basic Functionality");

		const compilerOpts: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES2016,
			esModuleInterop: true,
		};
		const fsMap = new Map<string, string>();

		const monorepoRoot = path.join(__dirname, "..", "..", "..");
		const fakeFolder = path.join(monorepoRoot, "fake");
		const exporter = path.join(fakeFolder, "file-with-export.ts");
		const index = path.join(fakeFolder, "index.ts");

		fsMap.set(exporter.replace(/\\/g, "/"), `export const helloWorld = "Example string";`);
		fsMap.set(
			index.replace(/\\/g, "/"),
			`import {helloWorld} from "./file-with-export"; console.log(helloWorld)`,
		);

		const system = createFSBackedSystem(fsMap, monorepoRoot, ts);
		const env = createVirtualTypeScriptEnvironment(system, [index, exporter], ts, compilerOpts);

		expect(env.getSourceFile(index)).toBeTruthy();

		env.deleteFile(index);

		expect(env.getSourceFile(index)).toBeFalsy();
	});
});
