import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createTwoslashCacheKey } from "./key.ts";
import { createTwoslashCacheStats } from "./stats.ts";
import { readCacheEntry, writeCacheEntry } from "./store.ts";
import type {
	ResolvedTwoslashCacheOptions,
	TwoslashCacheEnvironment,
	TwoslashCacheKeyInput,
	TwoslashCacheOptions,
} from "./types.ts";

function findNearestPackageJson(startPath: string) {
	let currentPath = startPath;

	for (;;) {
		const packageJsonPath = path.join(currentPath, "package.json");
		try {
			const require = createRequire(import.meta.url);
			const packageJson = require(packageJsonPath);
			if (
				packageJson &&
				typeof packageJson === "object" &&
				"version" in packageJson &&
				typeof packageJson.version === "string"
			) {
				return packageJson.version;
			}
			return undefined;
		} catch {
			const nextPath = path.dirname(currentPath);
			if (nextPath === currentPath) {
				return undefined;
			}
			currentPath = nextPath;
		}
	}
}

function resolvePackageVersion(specifier: string) {
	const require = createRequire(import.meta.url);

	try {
		const entryPath = require.resolve(specifier);
		return findNearestPackageJson(path.dirname(entryPath));
	} catch {
		return undefined;
	}
}

export function getTwoslashCacheEnvironment(): TwoslashCacheEnvironment {
	return {
		expressiveCodeTwoslashVersion: findNearestPackageJson(
			path.dirname(fileURLToPath(import.meta.url)),
		),
		twoslashVersion: resolvePackageVersion("@ec-ts/twoslash"),
		typescriptVersion: ts.version,
	};
}

export function resolveTwoslashCacheOptions(
	cwd: string,
	cache: boolean | TwoslashCacheOptions | undefined,
) {
	if (!cache) {
		return undefined;
	}

	const options = cache === true ? {} : cache;

	const resolved: ResolvedTwoslashCacheOptions = {
		dir: path.resolve(cwd, options.dir ?? ".cache/expressive-code-twoslash"),
		fingerprint: options.fingerprint,
		logLevel: options.logLevel ?? "summary",
	};

	return resolved;
}

export function createTwoslashCache(
	options: ResolvedTwoslashCacheOptions | undefined,
	environment: TwoslashCacheEnvironment,
) {
	if (!options) {
		return undefined;
	}

	const stats = createTwoslashCacheStats(options);
	stats.registerSummary();

	return {
		async getOrCompute<Result>(input: TwoslashCacheKeyInput, compute: () => Promise<Result>) {
			const key = createTwoslashCacheKey(environment, {
				...input,
				fingerprint: input.fingerprint ?? options.fingerprint,
			});

			const cached = await readCacheEntry<Result>(options.dir, key);

			if (cached.status === "hit") {
				stats.recordHit(key);
				return cached.value;
			}

			if (cached.status === "error") {
				stats.recordReadError(key, cached.error);
			}

			stats.recordMiss(key);

			const result = await compute();

			try {
				await writeCacheEntry(options.dir, key, result);
				stats.recordWrite(key);
			} catch (error) {
				stats.recordWriteError(key, error);
			}

			return result;
		},
	};
}
