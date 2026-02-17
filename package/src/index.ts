import { type ExpressiveCodePlugin, definePlugin } from "@expressive-code/core";
import { ExpressiveCode } from "expressive-code";
import { type TwoslashInstance, createTwoslasher } from 'twoslash';
import { createTwoslasher as createTwoslasherVue } from "twoslash-vue";
import { ModuleResolutionKind, type CompilerOptions } from "typescript";
import {
	TwoslashCompletionAnnotation,
	TwoslashCustomTagsAnnotation,
	TwoslashErrorBoxAnnotation,
	TwoslashErrorUnderlineAnnotation,
	TwoslashHighlightAnnotation,
	TwoslashHoverAnnotation,
	TwoslashStaticAnnotation,
} from "./annotations";
import {
	TwoslashIncludesManager,
	buildMetaChecker,
	checkForCustomTagsAndMerge,
	compareNodes,
	ecConfig,
	parseIncludeMeta,
	processCompletion,
	processTwoslashCodeBlock,
	renderJSDocs,
	renderType,
} from "./helpers";
import floatingUiCore from "./module-code/floating-ui-core.min";
import floatingUiDom from "./module-code/floating-ui-dom.min";
import hoverDocsManager from "./module-code/popup.min";
import { getTwoSlashBaseStyles, twoSlashStyleSettings } from "./styles";
import type { PluginTwoslashOptions, TwoSlashStyleSettings } from "./types";

export type { PluginTwoslashOptions, TwoSlashStyleSettings };

declare module "@expressive-code/core" {
	export interface StyleSettings {
		twoSlash: TwoSlashStyleSettings;
	}
}

/**
 * Default TypeScript compiler options used in TwoSlash.
 *
 * @constant
 * @type {CompilerOptions}
 * @default
 * 
 * The `moduleResolution` option is set to `ModuleResolutionKind.Bundler` (100) to ensure that module resolution works correctly in various environments, including bundlers and modern JavaScript runtimes.
 */
const defaultCompilerOptions: CompilerOptions = {
    moduleResolution: 100 satisfies ModuleResolutionKind.Bundler,
	lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
};

/**
 * Add Twoslash support to your Expressive Code TypeScript code blocks.
 *
 * @param {PluginTwoslashOptions} options - Configuration options for the plugin.
 * @see https://twoslash.studiocms.dev for the full documentation.
 * @returns A plugin object with the specified configuration.
 */
export default function ecTwoSlash(
	options: PluginTwoslashOptions = {},
): ExpressiveCodePlugin {
	/**
	 * Destructure the options object to extract configuration settings.
	 */
	const {
		explicitTrigger = true,
		languages = ["ts", "tsx", "vue"],
		includeJsDoc = true,
		allowNonStandardJsDocTags = true,
		twoslashOptions = checkForCustomTagsAndMerge(options.twoslashOptions),
	} = options;

	const availableTwoSlashers: Record<string, TwoslashInstance> = {
		'default': createTwoslasher(twoslashOptions),
		'vue': createTwoslasherVue(twoslashOptions),
	};

	const shouldTransform = buildMetaChecker(languages, explicitTrigger);

	const includesMap = new Map();

	return definePlugin({
		name: "expressive-code-twoslash",
		jsModules: [floatingUiCore, floatingUiDom, hoverDocsManager],
		styleSettings: twoSlashStyleSettings,
		baseStyles: (context) => getTwoSlashBaseStyles(context),
		hooks: {
			async preprocessCode({ codeBlock, config }) {
				if (shouldTransform(codeBlock)) {
					// Create a new instance of the TwoslashIncludesManager
					const includes = new TwoslashIncludesManager(includesMap);

					// Create a new instance of the Expressive Code Engine for use in the plugin
					const ecEngine = new ExpressiveCode(ecConfig(config));

					// Apply the includes to the code block
					const codeWithIncludes = includes.applyInclude(codeBlock.code);

					// Parse the include meta
					const include = parseIncludeMeta(codeBlock.meta);

					// Add the include to the includes map if it exists
					if (include) includes.add(include, codeWithIncludes);

					// Select the appropriate twoslasher based on language
					const selectedTwoslasher = availableTwoSlashers[codeBlock.language] ?? availableTwoSlashers.default;

					// Twoslash the code block
					const twoslash = selectedTwoslasher(codeWithIncludes, codeBlock.language, {
						...twoslashOptions,
						compilerOptions: {
							...defaultCompilerOptions,
							...(twoslashOptions?.compilerOptions ?? {}),
						},
					});

					// Update EC code block with the twoslash information
					if (twoslash.extension) {
						codeBlock.language = twoslash.extension;
					}

					// Process the Twoslash code block and replace the EC code block with the Twoslash code block
					processTwoslashCodeBlock(codeBlock, codeWithIncludes, twoslash.code);

					// Process the Twoslash Error Annotations
					for (const node of twoslash.errors) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(new TwoslashErrorUnderlineAnnotation(node));
							line.addAnnotation(new TwoslashErrorBoxAnnotation(node, line));
						}
					}

					// Process the Twoslash Static (Query) Annotations
					for (const node of twoslash.queries) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(
								new TwoslashStaticAnnotation(
									node,
									line,
									await renderType(node.text, ecEngine),
									await renderJSDocs(
										node,
										includeJsDoc,
										ecEngine,
										allowNonStandardJsDocTags,
									),
								),
							);
						}
					}

					// Process the Twoslash Highlight Annotations
					for (const node of twoslash.highlights) {
						const line = codeBlock.getLine(node.line);
						if (line) {
							line.addAnnotation(new TwoslashHighlightAnnotation(node));
						}
					}

					// Process the Twoslash Hover Annotations
					for (const node of twoslash.hovers) {
						// Check if the node is already added as a static
						const query = twoslash.queries.find((q) =>
							compareNodes(q, node, { line: true, text: true }),
						);

						// Check if the node is already added as an error
						const error = twoslash.errors.find((e) =>
							compareNodes(e, node, {
								line: true,
								start: true,
								length: true,
								character: true,
							}),
						);

						// Skip if the node is already added as a static or error annotation
						if (query || error) {
							continue;
						}

						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(
								new TwoslashHoverAnnotation(
									node,
									await renderType(node.text, ecEngine),
									await renderJSDocs(
										node,
										includeJsDoc,
										ecEngine,
										allowNonStandardJsDocTags,
									),
								),
							);
						}
					}

					// Process the Twoslash Completion Annotations
					for (const node of twoslash.completions) {
						// Process the completion item
						const processed = processCompletion(node);
						const line = codeBlock.getLine(node.line);

						if (line) {
							// Check if the node has a hover annotation
							const currentHoverAnnotations = line
								.getAnnotations()
								.filter((a) => a instanceof TwoslashHoverAnnotation);

							// Modify the inline range of the hover annotation
							for (const annotation of currentHoverAnnotations) {
								if (annotation.inlineRange) {
									const { columnStart, columnEnd } = annotation.inlineRange;
									if (
										processed.startCharacter >= columnStart &&
										processed.startCharacter <= columnEnd
									) {
										annotation.inlineRange.columnStart =
											processed.startCharacter;
									}
								}

								if (
									annotation.hover.start === processed.startCharacter &&
									annotation.hover.length === processed.length
								) {
									line.deleteAnnotation(annotation);
								}
							}

							line.addAnnotation(
								new TwoslashCompletionAnnotation(processed, node, line),
							);
						}
					}

					// Process the Twoslash Custom Tags Annotations
					for (const node of twoslash.tags) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(new TwoslashCustomTagsAnnotation(node, line));
						}
					}
				}
			},
		},
	});
}