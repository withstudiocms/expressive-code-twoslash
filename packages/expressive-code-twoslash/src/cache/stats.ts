import type { ResolvedTwoslashCacheOptions, TwoslashCacheStats } from "./types.ts";

function createInitialStats(): TwoslashCacheStats {
	return {
		hits: 0,
		misses: 0,
		writes: 0,
		readErrors: 0,
		writeErrors: 0,
	};
}

export function createTwoslashCacheStats(options: ResolvedTwoslashCacheOptions) {
	const stats = createInitialStats();
	let didRegisterSummary = false;

	function debug(message: string) {
		if (options.logLevel === "debug") {
			console.info(`[twoslash-cache] ${message}`);
		}
	}

	function registerSummary() {
		if (didRegisterSummary || options.logLevel === "off") {
			return;
		}

		didRegisterSummary = true;

		process.once("exit", () => {
			const total = stats.hits + stats.misses;
			if (total === 0 || options.logLevel === "off") {
				return;
			}

			const hitRate = ((stats.hits / total) * 100).toFixed(1);
			console.info(
				`[twoslash-cache] hits=${stats.hits} misses=${stats.misses} writes=${stats.writes} readErrors=${stats.readErrors} writeErrors=${stats.writeErrors} hitRate=${hitRate}% dir=${options.dir}`,
			);
		});
	}

	function recordHit(key: string) {
		stats.hits += 1;
		debug(`hit key=${key}`);
	}

	function recordMiss(key: string) {
		stats.misses += 1;
		debug(`miss key=${key}`);
	}

	function recordWrite(key: string) {
		stats.writes += 1;
		debug(`write key=${key}`);
	}

	function recordReadError(key: string, error: unknown) {
		stats.readErrors += 1;
		debug(`read-error key=${key} error=${String(error)}`);
	}

	function recordWriteError(key: string, error: unknown) {
		stats.writeErrors += 1;
		debug(`write-error key=${key} error=${String(error)}`);
	}

	return {
		stats,
		registerSummary,
		recordHit,
		recordMiss,
		recordWrite,
		recordReadError,
		recordWriteError,
	};
}
