export type TwoslashCacheLogLevel = "off" | "summary" | "debug";

export interface TwoslashCacheOptions {
	/**
	 * Directory used to persist cached Twoslash JSON artifacts.
	 *
	 * Relative paths resolve from the plugin `cwd`.
	 *
	 * @default ".cache/expressive-code-twoslash"
	 */
	dir?: string;

	/**
	 * Additional caller-controlled fingerprint to invalidate all cache entries.
	 */
	fingerprint?: string;

	/**
	 * Cache logging verbosity.
	 *
	 * @default "summary"
	 */
	logLevel?: TwoslashCacheLogLevel;
}

export interface ResolvedTwoslashCacheOptions {
	dir: string;
	fingerprint?: string;
	logLevel: TwoslashCacheLogLevel;
}

export interface TwoslashCacheEnvironment {
	expressiveCodeTwoslashVersion?: string;
	twoslashVersion?: string;
	typescriptVersion: string;
}

export interface TwoslashCacheKeyInput {
	code: string;
	extension: string;
	createOptions?: unknown;
	executeOptions?: unknown;
	pluginContext?: unknown;
	fingerprint?: string;
}

export interface TwoslashCacheStats {
	hits: number;
	misses: number;
	writes: number;
	readErrors: number;
	writeErrors: number;
}
