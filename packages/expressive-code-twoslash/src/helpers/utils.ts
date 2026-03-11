import fs from "node:fs";
import path from "node:path";
import type {
	TwoslashExecuteOptions,
	TwoslashGenericFunction,
	TwoslashInstance,
	TwoslashOptions,
} from "@ec-ts/twoslash";
import { createTwoslasher } from "@ec-ts/twoslash";
import type { CreateTwoslashVueOptions } from "@ec-ts/twoslash-vue";
import type { ExpressiveCodeBlock } from "@expressive-code/core";
import type { CreateTwoslashESLintOptions } from "twoslash-eslint";
import ts from "typescript";
import type { PluginTwoslashOptions } from "../types.ts";
import { reTrigger, twoslashDefaultTags } from "./regex.ts";

/**
 * Calculates the width of a given text in pixels based on the character location, font size, and character width.
 *
 * @param textLoc - The location of the text (number of characters).
 * @param fontSize - The font size in pixels. Defaults to 16.
 * @param charWidth - The width of a single character in pixels. Defaults to 8.
 * @returns The width of the text in pixels.
 */
export function getTextWidthInPixels(textLoc: number, fontSize = 16, charWidth = 8): number {
	return textLoc * charWidth * (fontSize / 16);
}

/**
 * Merges custom tags from the provided `twoslashOptions` with the default tags.
 * Ensures that there are no duplicate tags in the final list.
 *
 * @param twoslashOptions - The options object containing custom tags to be merged.
 * @returns A new `TwoslashOptions` object with merged custom tags.
 */
export function checkForCustomTagsAndMerge(twoslashOptions: TwoslashOptions | undefined) {
	const customTags = twoslashOptions?.customTags ?? [];
	const defaultTags = twoslashDefaultTags;

	const allTags: string[] = [...defaultTags];

	for (const tag of customTags) {
		if (!allTags.includes(tag)) {
			allTags.push(tag);
		}
	}

	return {
		...twoslashOptions,
		customTags: allTags,
	} as TwoslashOptions;
}

export type TwoslasherThunk = () => Promise<
	TwoslashInstance | TwoslashGenericFunction<TwoslashExecuteOptions>
>;

/**
 * Interface representing the data structure for a Twoslash instance, including its trigger pattern, supported languages, and the corresponding twoslasher functions.
 */
export interface TwoslashMapData {
	trigger: RegExp;
	languages: readonly string[];
	twoslashers: (options: TwoslashOptions) => {
		default: TwoslasherThunk;
		[key: string]: TwoslasherThunk;
	};
}

export const BuiltInTwoslashers = ["twoslash", "eslint"] as const;

export type BuiltInTwoslashers = (typeof BuiltInTwoslashers)[number];

type TwoslashInstanceMap = Map<string, TwoslasherThunk>;

/**
 * Retrieves or creates a base Twoslash instance and caches it in the `TwoslasherMap` for future use. If an instance already exists for the "twoslash" key, it returns the cached instance; otherwise, it creates a new one using the provided options and stores it in the map before returning it.
 */
const getBaseTwoslasher = (
	opts: TwoslashOptions | undefined,
	TwoslasherMap: TwoslashInstanceMap,
): TwoslasherThunk => {
	const key = "twoslash";
	const twoslasher = TwoslasherMap.get(key);
	if (!twoslasher) {
		const instance = async () => createTwoslasher(opts);
		TwoslasherMap.set(key, instance);
		return instance;
	}
	return twoslasher;
};

/**
 * Retrieves or creates a Twoslash instance specific to Vue and caches it in the `TwoslasherMap` for future use. If an instance already exists for the "twoslash-vue" key, it returns the cached instance; otherwise, it attempts to create a new one using the provided options and stores it in the map before returning it. If the module fails to load, it logs an error and throws a new error with a user-friendly message.
 */
const getVueTwoslasher = (
	opts: CreateTwoslashVueOptions | undefined,
	TwoslasherMap: TwoslashInstanceMap,
): TwoslasherThunk => {
	const key = "twoslash-vue";
	const twoslasher = TwoslasherMap.get(key);
	if (!twoslasher) {
		try {
			const instance = async () => (await import("@ec-ts/twoslash-vue")).createTwoslasher(opts);
			TwoslasherMap.set(key, instance);
			return instance;
		} catch (error) {
			console.error("Failed to load twoslash-vue:", error);
			throw new Error("Failed to load twoslash-vue. Please ensure vue is installed and try again.");
		}
	}
	return twoslasher;
};

/**
 * Retrieves or creates a Twoslash instance specific to ESLint and caches it in the `TwoslasherMap` for future use. If an instance already exists for the "eslint" key, it returns the cached instance; otherwise, it attempts to create a new one using the provided options and stores it in the map before returning it. If the module fails to load, it logs an error and throws a new error with a user-friendly message.
 */
const getEslintTwoslasher = (
	opts: CreateTwoslashVueOptions | undefined,
	TwoslasherMap: TwoslashInstanceMap,
): TwoslasherThunk => {
	const key = "eslint";
	const twoslasher = TwoslasherMap.get(key);
	if (!twoslasher) {
		try {
			const instance = async () =>
				(await import("twoslash-eslint")).createTwoslasher(
					opts as CreateTwoslashESLintOptions,
				) as TwoslashGenericFunction<TwoslashExecuteOptions>;
			TwoslasherMap.set(key, instance);
			return instance;
		} catch (error) {
			console.error("Failed to load twoslash-eslint:", error);
			throw new Error(
				"Failed to load twoslash-eslint. Please ensure eslint is installed and try again.",
			);
		}
	}
	return twoslasher;
};

/**
 * A map that holds the configuration for built-in twoslash instances, including their trigger patterns, supported languages, and the corresponding twoslasher functions.
 */
export const TwoslashInstanceMap = (TwoslasherMap: TwoslashInstanceMap) =>
	new Map<BuiltInTwoslashers, TwoslashMapData>([
		[
			"twoslash",
			{
				trigger: reTrigger,
				languages: ["ts", "tsx", "vue"],
				twoslashers: (options: TwoslashOptions) => ({
					default: getBaseTwoslasher(options, TwoslasherMap),
					vue: getVueTwoslasher(options, TwoslasherMap),
				}),
			},
		],
		[
			"eslint",
			{
				trigger: /\beslint\b/,
				languages: ["ts", "tsx"],
				twoslashers: (options: TwoslashOptions) => ({
					default: getEslintTwoslasher(options, TwoslasherMap),
				}),
			},
		],
	]);

/**
 * Retrieves a twoslasher instance configuration and applies optional overrides from plugin options.
 *
 * @param key - The built-in twoslasher type identifier to retrieve from the instance map
 * @param opts - Optional plugin configuration containing instance-specific overrides
 *
 * @returns An object containing the twoslasher instances, trigger pattern, and supported languages
 *
 * @throws {Error} When no twoslash instance is found for the provided key
 *
 * @internal
 */
const __getTwoslasherAndOverride = (
	key: BuiltInTwoslashers,
	opts: PluginTwoslashOptions["instanceConfigs"],
	TwoslasherMap: TwoslashInstanceMap,
) => {
	const _TwoslashInstanceMap = TwoslashInstanceMap(TwoslasherMap);

	const data = _TwoslashInstanceMap.get(key);

	if (!data) {
		throw new Error(`No twoslash instance found for key: ${key}`);
	}

	const { trigger, languages, twoslashers } = data;

	const triggerOverride = opts?.[key]?.explicitTrigger;

	const languagesOverride = opts?.[key]?.languages;

	return {
		twoslashers,
		trigger: triggerOverride instanceof RegExp ? triggerOverride : trigger,
		languages: languagesOverride ?? languages,
	};
};

/**
 * Creates a function that applies Twoslash transformations to code blocks.
 *
 * @param opts - Plugin configuration options for Twoslash instances
 * @param options - Twoslash processing options
 * @returns A function that processes a code block and applies the appropriate Twoslash transformer based on language and metadata triggers
 *
 * @template A - The return type of the transformation function
 *
 * @example
 * ```ts
 * const transformer = getTwoslasher(config, options);
 * const result = await transformer(codeBlock, (twoslash) => twoslash.transform());
 * ```
 */
export const getTwoslasher = (
	opts: PluginTwoslashOptions["instanceConfigs"],
	options: TwoslashOptions,
	TwoslasherMap: TwoslashInstanceMap,
) => {
	const twoslashersMap = BuiltInTwoslashers.reduce(
		(acc, key) => {
			const twoslasher = __getTwoslasherAndOverride(key, opts, TwoslasherMap);
			acc[key] = twoslasher;
			return acc;
		},
		{} as Record<string, TwoslashMapData>,
	);

	return async <A>(
		codeBlock: ExpressiveCodeBlock,
		fn: (
			transformer: TwoslashInstance | TwoslashGenericFunction<TwoslashExecuteOptions>,
			trigger: string,
		) => Promise<A> | A,
	) => {
		for (const key in twoslashersMap) {
			const { trigger, languages, twoslashers } = twoslashersMap[key as BuiltInTwoslashers];

			if (languages.includes(codeBlock.language) && trigger.test(codeBlock.meta)) {
				const transformer =
					twoslashers(options)[codeBlock.language] ?? twoslashers(options).default;
				return fn(await transformer(), key);
			}
		}
		return null;
	};
};

export const resolveTsconfigPath = (paths: string, overridePath?: string): string => {
	if (overridePath === undefined) {
		return path.join(paths, "tsconfig.json");
	}
	if (path.isAbsolute(overridePath) === true) {
		return overridePath;
	}
	return path.resolve(paths, overridePath);
};

export const parseSnippetTsconfig = (
	tsconfigPath: string,
): { source: string; options: ts.CompilerOptions } => {
	if (fs.existsSync(tsconfigPath) === false) {
		throw new Error(`tsconfig not found at ${tsconfigPath}`);
	}

	const source = fs.readFileSync(tsconfigPath, "utf8");
	const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
	if (configFile.error !== undefined) {
		const message = ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n");
		throw new Error(`Unable to read ${tsconfigPath}: ${message}`);
	}

	const parsed = ts.parseJsonConfigFileContent(
		configFile.config,
		ts.sys,
		path.dirname(tsconfigPath),
		undefined,
		tsconfigPath,
	);

	return { source, options: parsed.options };
};
