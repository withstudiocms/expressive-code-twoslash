/** biome-ignore-all lint/suspicious/noExplicitAny: In tests this is fine */
/** biome-ignore-all lint/style/noNonNullAssertion: In tests this is fine */

import * as allure from "allure-js-commons";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import {
	createDefaultMapFromCDN,
	createDefaultMapFromNodeModules,
	createSystem,
	createVirtualCompilerHost,
	createVirtualTypeScriptEnvironment,
	knownLibFilesForCompilerOptions,
} from "../src/index.ts";
import { parentSuiteName } from "./test-utils.ts";

describe(parentSuiteName, () => {
	it("runs a virtual environment and gets the right results from the LSP", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Basic Functionality");

		const fsMap = createDefaultMapFromNodeModules({});
		fsMap.set("index.ts", "const hello = 'hi'");

		const system = createSystem(fsMap);

		const compilerOpts = {};
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);

		// You can then interact with the languageService to introspect the code
		const definitions = env.languageService.getDefinitionAtPosition("index.ts", 7);
		expect(definitions).toMatchInlineSnapshot(`
    [
      {
        "containerKind": undefined,
        "containerName": "",
        "contextSpan": {
          "length": 18,
          "start": 0,
        },
        "failedAliasResolution": false,
        "fileName": "index.ts",
        "isAmbient": false,
        "isLocal": false,
        "kind": "const",
        "name": "hello",
        "textSpan": {
          "length": 5,
          "start": 6,
        },
        "unverified": false,
      },
    ]
  `);
	});

	// Previously lib.dom.d.ts was not included
	it("runs a virtual environment with the default globals", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Basic Functionality with Globals");

		const fsMap = createDefaultMapFromNodeModules({});
		fsMap.set("index.ts", "console.log('Hi!'')");

		const system = createSystem(fsMap);
		const compilerOpts = {};
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);

		const definitions = env.languageService.getDefinitionAtPosition("index.ts", 7)!;
		expect(definitions.length).toBeGreaterThan(0);
	});

	// Ensures that people can include something lib es2015 etc
	it("handles 'lib' in compiler options", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Handling 'lib' in Compiler Options");

		const compilerOpts = {
			lib: ["es2015", "ES2020"],
		};
		const fsMap = createDefaultMapFromNodeModules(compilerOpts);
		fsMap.set("index.ts", "Object.keys(console)");

		const system = createSystem(fsMap);
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);

		const definitions = env.languageService.getDefinitionAtPosition("index.ts", 7)!;
		expect(definitions.length).toBeGreaterThan(0);
	});

	//
	it("compiles in the right DTS files", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Compiling with DTS Files");

		const opts = { target: ts.ScriptTarget.ES2015 };

		const fsMap = createDefaultMapFromNodeModules(opts);
		fsMap.set("index.ts", "[1,3,5,6].find(a => a === 2)");

		const system = createSystem(fsMap);
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, opts);

		const semDiags = env.languageService.getSemanticDiagnostics("index.ts");
		expect(semDiags.length).toBe(0);
	});

	it("emits new files to the fsMap", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Emitting Files to the Virtual File System");

		const fsMap = createDefaultMapFromNodeModules({});
		fsMap.set("index.ts", "console.log('Hi!'')");

		const system = createSystem(fsMap);
		const compilerOpts = {};
		const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts);
		const emitted = env.languageService.getProgram()?.emit(undefined, system.writeFile);

		expect(emitted!.emitSkipped).toEqual(false);
		expect(Array.from(fsMap.keys())).toContain("index.js");
	});

	it("creates a map from the CDN without cache", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Creating a Map from the CDN without Cache");

		const fetcher = vi.fn();
		fetcher.mockResolvedValue({ text: () => Promise.resolve("// Contents of file") });
		const store = vi.fn() as any;

		const compilerOpts = { target: ts.ScriptTarget.ES5 };
		const libs = knownLibFilesForCompilerOptions(compilerOpts, ts);
		expect(libs.length).toBeGreaterThan(0);

		const map = await createDefaultMapFromCDN(
			compilerOpts,
			"3.7.3",
			false,
			ts,
			undefined,
			fetcher,
			store,
		);
		expect(map.size).toBeGreaterThan(0);

		libs.forEach((l) => {
			expect(map.get(`/${l}`)).toBeDefined();
		});
	});

	it("creates a map from the CDN and stores it in local storage cache", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Creating a Map from the CDN and Storing it in Local Storage Cache");

		const fetcher = vi.fn();
		fetcher.mockResolvedValue({ text: () => Promise.resolve("// Contents of file") });

		const store: any = {
			getItem: vi.fn(),
			setItem: vi.fn(),
		};

		const compilerOpts = { target: ts.ScriptTarget.ES5 };
		const libs = knownLibFilesForCompilerOptions(compilerOpts, ts);
		expect(libs.length).toBeGreaterThan(0);

		const map = await createDefaultMapFromCDN(
			compilerOpts,
			"3.7.3",
			true,
			ts,
			undefined,
			fetcher,
			store,
		);
		expect(map.size).toBeGreaterThan(0);

		libs.forEach((l) => {
			expect(map.get(`/${l}`)).toBeDefined();
		});

		expect(store.setItem).toHaveBeenCalledTimes(libs.length);
	});

	it("creates a map from the CDN and uses the existing local storage cache", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Creating a Map from the CDN and Using the Existing Local Storage Cache");

		const fetcher = vi.fn();
		fetcher.mockResolvedValue({ text: () => Promise.resolve("// Contents of file") });

		const store: any = {
			getItem: vi.fn(),
			setItem: vi.fn(),
		};

		// Once return a value from the store
		store.getItem.mockReturnValueOnce("// From Cache");

		const compilerOpts = { target: ts.ScriptTarget.ES5 };
		const libs = knownLibFilesForCompilerOptions(compilerOpts, ts);
		expect(libs.length).toBeGreaterThan(0);

		const map = await createDefaultMapFromCDN(
			compilerOpts,
			"3.7.3",
			true,
			ts,
			undefined,
			fetcher,
			store,
		);
		expect(map.size).toBeGreaterThan(0);

		libs.forEach((l) => {
			expect(map.get(`/${l}`)).toBeDefined();
		});

		// Should be one less fetch, and the first item would be from the cache instead
		expect(store.setItem).toHaveBeenCalledTimes(libs.length - 1);
		expect(map.get(`/${libs[0]}`)).toMatchInlineSnapshot(`"// From Cache"`);
	});

	[
		{
			name: "handles blank",
			config: {},
			validate: (libs: string[]) => expect(libs.length).toBeGreaterThan(0),
		},
		{
			name: "handles a target",
			config: { target: ts.ScriptTarget.ES2017 },
			validate: (libs: string[], baseline: string[]) =>
				expect(libs.length).toBeGreaterThan(baseline.length),
		},
		{
			name: "handles lib",
			config: { lib: ["ES2020"] },
			validate: (libs: string[], baseline: string[]) =>
				expect(libs.length).toBeGreaterThan(baseline.length),
		},
		{
			name: "handles both",
			config: { lib: ["ES2020"], target: ts.ScriptTarget.ES2016 },
			validate: (libs: string[], baseline: string[]) =>
				expect(libs.length).toBeGreaterThan(baseline.length),
		},
		{
			name: "actually includes the right things",
			config: { target: ts.ScriptTarget.ES2016 },
			validate: (libs: string[]) => expect(libs).toContain("lib.es2016.d.ts"),
		},
	].forEach(({ name, config, validate }) => {
		it(name, async () => {
			await allure.parentSuite(parentSuiteName);
			await allure.suite("Virtual TypeScript Environment");
			await allure.subSuite(`knownLibFilesForCompilerOptions - ${name}`);

			const baseline = knownLibFilesForCompilerOptions({}, ts);
			const libs = knownLibFilesForCompilerOptions(config, ts);
			validate(libs, baseline);
		});
	});

	it("throws when you request a lib file which isn't in the fsMap", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Throwing When Requesting a Lib File Not in the fsMap");

		const t = () => {
			const fsMap = new Map();
			fsMap.set("index.js", "// hi there");
			const system = createSystem(fsMap);
			const host = createVirtualCompilerHost(system, { target: ts.ScriptTarget.ES2020 }, ts);
			ts.createProgram({
				rootNames: ["/index.js"],
				options: { target: ts.ScriptTarget.ES2020 },
				host: host.compilerHost,
			});
		};

		expect(t).toThrow();
	});

	it("grabs lib dts files from node_modules", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Grabbing Lib DTS Files from Node Modules");

		const fsMap = createDefaultMapFromNodeModules({});
		expect(fsMap.get("/lib.es2015.collection.d.ts")).toBeDefined();
	});

	it("empty file content", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Handling Empty File Content");

		const options = { target: ts.ScriptTarget.ES2020 };
		const fsMap = createDefaultMapFromNodeModules(options, ts);
		fsMap.set("index.ts", "");
		const system = createSystem(fsMap);
		const host = createVirtualCompilerHost(system, options, ts);
		ts.createProgram({
			rootNames: ["index.ts"],
			options,
			host: host.compilerHost,
		});
	});

	it("moduleDetection options", async () => {
		await allure.parentSuite(parentSuiteName);
		await allure.suite("Virtual TypeScript Environment");
		await allure.subSuite("Handling Module Detection Options");

		const options: ts.CompilerOptions = {
			module: ts.ModuleKind.AMD,
			moduleDetection: ts.ModuleDetectionKind.Force,
		};
		const fsMap = createDefaultMapFromNodeModules(options, ts);
		fsMap.set("index.ts", "let foo = 'foo'");
		const system = createSystem(fsMap);
		const host = createVirtualCompilerHost(system, options, ts);
		const program = ts.createProgram({
			rootNames: ["index.ts"],
			options,
			host: host.compilerHost,
		});
		program.emit();
		expect(fsMap.get("index.js")).toEqual(
			`define(["require", "exports"], function (require, exports) {\n    "use strict";\n    Object.defineProperty(exports, "__esModule", { value: true });\n    var foo = 'foo';\n});\n`,
		);
	});
});
