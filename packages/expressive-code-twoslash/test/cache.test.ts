import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTwoslashCache, resolveTwoslashCacheOptions } from "../src/cache/index.ts";
import { createTwoslashCacheKey } from "../src/cache/key.ts";
import { readCacheEntry, writeCacheEntry } from "../src/cache/store.ts";

const tempDirs: string[] = [];

async function createTempDir() {
	const dir = await mkdtemp(path.join(os.tmpdir(), "ec-twoslash-cache-"));
	tempDirs.push(dir);
	return dir;
}

afterEach(async () => {
	await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })));
	vi.restoreAllMocks();
});

describe("twoslash cache", () => {
	it("creates stable keys for equivalent inputs", () => {
		const environment = {
			expressiveCodeTwoslashVersion: "0.6.1",
			twoslashVersion: "1.0.0",
			typescriptVersion: "5.9.3",
		};

		const left = createTwoslashCacheKey(environment, {
			code: "const value = 1",
			extension: "ts",
			executeOptions: {
				compilerOptions: {
					strict: true,
					lib: ["lib.es2022.d.ts"],
				},
			},
			pluginContext: {
				tsConfigSource: JSON.stringify({ compilerOptions: { strict: true } }),
			},
		});

		const right = createTwoslashCacheKey(environment, {
			code: "const value = 1",
			extension: "ts",
			executeOptions: {
				compilerOptions: {
					lib: ["lib.es2022.d.ts"],
					strict: true,
				},
			},
			pluginContext: {
				tsConfigSource: JSON.stringify({ compilerOptions: { strict: true } }),
			},
		});

		expect(left).toBe(right);
	});

	it("invalidates when the fingerprint changes", () => {
		const environment = {
			expressiveCodeTwoslashVersion: "0.6.1",
			twoslashVersion: "1.0.0",
			typescriptVersion: "5.9.3",
		};

		const left = createTwoslashCacheKey(environment, {
			code: "const value = 1",
			extension: "ts",
			fingerprint: "alpha",
		});

		const right = createTwoslashCacheKey(environment, {
			code: "const value = 1",
			extension: "ts",
			fingerprint: "beta",
		});

		expect(left).not.toBe(right);
	});

	it("roundtrips cached json entries", async () => {
		const dir = await createTempDir();

		await writeCacheEntry(dir, "abcdef", { code: "const value = 1" });

		const result = await readCacheEntry<{ code: string }>(dir, "abcdef");
		expect(result).toEqual({
			status: "hit",
			value: { code: "const value = 1" },
		});
	});

	it("treats corrupt entries as cache errors", async () => {
		const dir = await createTempDir();
		const filePath = path.join(dir, "ab", "abcdef.json");

		await mkdir(path.dirname(filePath), { recursive: true });
		await writeFile(filePath, "{bad json", { encoding: "utf8" });

		const result = await readCacheEntry(dir, "abcdef");
		expect(result.status).toBe("error");
	});

	it("hits the cache on a warm run", async () => {
		const cwd = await createTempDir();
		const cache = createTwoslashCache(
			resolveTwoslashCacheOptions(cwd, {
				dir: ".cache/twoslash",
				logLevel: "off",
			}),
			{
				expressiveCodeTwoslashVersion: "0.6.1",
				twoslashVersion: "1.0.0",
				typescriptVersion: "5.9.3",
			},
		);

		if (!cache) {
			throw new Error("Cache should be enabled");
		}

		const compute = vi.fn(async () => ({ code: "const greeting = 'hi'" }));

		const cold = await cache.getOrCompute(
			{
				code: "const greeting = 'hi'",
				extension: "ts",
				executeOptions: { compilerOptions: { strict: true } },
			},
			compute,
		);

		const warm = await cache.getOrCompute(
			{
				code: "const greeting = 'hi'",
				extension: "ts",
				executeOptions: { compilerOptions: { strict: true } },
			},
			compute,
		);

		expect(cold).toEqual({ code: "const greeting = 'hi'" });
		expect(warm).toEqual(cold);
		expect(compute).toHaveBeenCalledTimes(1);
	});
});
