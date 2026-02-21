import type { ExpressiveCodeBlock } from "@expressive-code/core";
import type {
	TwoslashExecuteOptions,
	TwoslashGenericFunction,
	TwoslashInstance,
	TwoslashOptions,
} from "twoslash";
import { createTwoslasher } from "twoslash";
import {
	type CreateTwoslashESLintOptions,
	createTwoslasher as createTwoslasherEslint,
} from "twoslash-eslint";
import { createTwoslasher as createTwoslasherVue } from "twoslash-vue";
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

/**
 * Interface representing the data structure for a Twoslash instance, including its trigger pattern, supported languages, and the corresponding twoslasher functions.
 */
export interface TwoslashMapData {
	trigger: RegExp;
	languages: readonly string[];
	twoslashers: (options: TwoslashOptions) => {
		default: TwoslashGenericFunction<TwoslashExecuteOptions>;
		[key: string]: TwoslashGenericFunction<TwoslashExecuteOptions>;
	};
}

export const BuiltInTwoslashers = ["twoslash", "eslint"] as const;

export type BuiltInTwoslashers = (typeof BuiltInTwoslashers)[number];

/**
 * A map that holds the configuration for built-in twoslash instances, including their trigger patterns, supported languages, and the corresponding twoslasher functions.
 */
export const TwoslashInstanceMap = new Map<BuiltInTwoslashers, TwoslashMapData>([
	[
		"twoslash",
		{
			trigger: reTrigger,
			languages: ["ts", "tsx", "vue"],
			twoslashers: (options: TwoslashOptions) => ({
				default: createTwoslasher(options),
				vue: createTwoslasherVue(options),
			}),
		},
	],
	[
		"eslint",
		{
			trigger: /\beslint\b/,
			languages: ["ts", "tsx"],
			twoslashers: (options: TwoslashOptions) => ({
				default: createTwoslasherEslint(
					options as CreateTwoslashESLintOptions,
				) as TwoslashGenericFunction<TwoslashExecuteOptions>,
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
) => {
	const data = TwoslashInstanceMap.get(key);

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
) => {
	const twoslashersMap = BuiltInTwoslashers.reduce(
		(acc, key) => {
			const twoslasher = __getTwoslasherAndOverride(key, opts);
			acc[key] = twoslasher;
			return acc;
		},
		{} as Record<string, TwoslashMapData>,
	);

	return <A>(
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
				return fn(transformer, key);
			}
		}
		return null;
	};
};
