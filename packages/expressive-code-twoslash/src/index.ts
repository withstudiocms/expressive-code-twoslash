import { definePlugin, type ExpressiveCodePlugin } from "@expressive-code/core";
import { ExpressiveCode } from "expressive-code";
import type {
	NodeCompletion,
	NodeError,
	NodeHighlight,
	NodeHover,
	NodeQuery,
	NodeTag,
} from "twoslash";
import type { CompilerOptions, ModuleResolutionKind } from "typescript";
import {
	TwoslashCompletionAnnotation,
	TwoslashCustomTagsAnnotation,
	TwoslashErrorBoxAnnotation,
	TwoslashErrorUnderlineAnnotation,
	TwoslashHighlightAnnotation,
	TwoslashHoverAnnotation,
	TwoslashStaticAnnotation,
} from "./annotations/index.ts";
import { instanceConfigsDefaults, twoslashEslintDefaults } from "./consts.ts";
import {
	checkForCustomTagsAndMerge,
	compareNodes,
	ecConfig,
	getTwoslasher,
	parseIncludeMeta,
	processCompletion,
	processTwoslashCodeBlock,
	renderJSDocs,
	renderType,
	TwoslashIncludesManager,
} from "./helpers/index.ts";
import floatingUiCore from "./module-code/floating-ui-core.min.ts";
import floatingUiDom from "./module-code/floating-ui-dom.min.ts";
import hoverDocsManager from "./module-code/popup.min.ts";
import { getTwoSlashBaseStyles, twoSlashStyleSettings } from "./styles.ts";
import type { PluginTwoslashOptions, TwoSlashStyleSettings } from "./types.ts";

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
 *
 * These defaults are chosen to provide a good baseline for most TypeScript code samples, but they can be overridden by passing custom compiler options in the `twoslashOptions` when initializing the plugin.
 *
 * @see https://github.com/shikijs/shiki/blob/213f19bf464423795f20ce51fe73fe7bb5d45e00/packages/twoslash/src/index.ts#L22-L32 for Shiki's default Twoslash compiler options.
 *
 * The `lib` option is our default set of libraries that we include for Twoslash code blocks, which includes the latest ECMAScript features and DOM APIs. This ensures that users can use modern JavaScript and TypeScript features in their code blocks without needing to manually specify these libraries in their compiler options.
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
export default function ecTwoSlash(options: PluginTwoslashOptions = {}): ExpressiveCodePlugin {
	/**
	 * Destructure the options object to extract configuration settings.
	 */
	const {
		instanceConfigs = {
			...instanceConfigsDefaults,
			...options.instanceConfigs,
		},
		includeJsDoc = true,
		// This setting is important to allow users to use customTag annotations in their codeblocks
		allowNonStandardJsDocTags = true,
		twoslashOptions = checkForCustomTagsAndMerge(options.twoslashOptions),
		twoslashVueOptions = options.twoslashVueOptions,
		twoslashEslintOptions = {
			...twoslashEslintDefaults,
			...options.twoslashEslintOptions,
		},
	} = options;

	// Get the Twoslash transformation function based on the provided instance configurations and options
	const shouldTransform = getTwoslasher(instanceConfigs, {
		...twoslashOptions,
		...twoslashVueOptions,
		...twoslashEslintOptions,
	});

	// Map to hold the includes for Twoslash code blocks, keyed by the include name
	const includesMap = new Map();

	return definePlugin({
		name: "expressive-code-twoslash",
		jsModules: [floatingUiCore, floatingUiDom, hoverDocsManager],
		styleSettings: twoSlashStyleSettings,
		baseStyles: (context) => getTwoSlashBaseStyles(context),
		hooks: {
			async preprocessCode({ codeBlock, config }) {
				// Check if the code block should be transformed with Twoslash based on the trigger and language
				await shouldTransform(codeBlock, async (twoslasher, trigger) => {
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

					const extension =
						trigger === "twoslash" ? codeBlock.language : `index.${codeBlock.language}`;

					// Twoslash the code block
					const twoslash = twoslasher(codeWithIncludes, extension, {
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

					// Create arrays to hold the different types of nodes for post-processing
					const nodeErrors: NodeError[] = [];
					const nodeQueries: NodeQuery[] = [];
					const nodeHighlights: NodeHighlight[] = [];
					const nodeHovers: NodeHover[] = [];
					const nodeCompletions: NodeCompletion[] = [];
					const nodeTags: NodeTag[] = [];

					// Process Generic nodes to extract errors and other annotations that require post-processing
					for (const node of twoslash.nodes) {
						switch (node.type) {
							case "error": {
								nodeErrors.push(node);
								break;
							}
							case "query": {
								nodeQueries.push(node);
								break;
							}
							case "highlight": {
								nodeHighlights.push(node);
								break;
							}
							case "hover": {
								nodeHovers.push(node);
								break;
							}
							case "completion": {
								nodeCompletions.push(node);
								break;
							}
							case "tag": {
								nodeTags.push(node);
								break;
							}
						}
					}

					// Process the Twoslash Error Annotations
					for (const node of nodeErrors) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(new TwoslashErrorUnderlineAnnotation(node));
							line.addAnnotation(new TwoslashErrorBoxAnnotation(node, line));
						}
					}

					// Process the Twoslash Static (Query) Annotations
					for (const node of nodeQueries) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(
								new TwoslashStaticAnnotation(
									node,
									line,
									await renderType(node.text, ecEngine),
									await renderJSDocs(node, includeJsDoc, ecEngine, allowNonStandardJsDocTags),
								),
							);
						}
					}

					// Process the Twoslash Highlight Annotations
					for (const node of nodeHighlights) {
						const line = codeBlock.getLine(node.line);
						if (line) {
							line.addAnnotation(new TwoslashHighlightAnnotation(node));
						}
					}

					// Process the Twoslash Hover Annotations
					for (const node of nodeHovers) {
						// Check if the node is already added as a static
						const query = nodeQueries.find((q) =>
							compareNodes(q, node, { line: true, text: true }),
						);

						// Check if the node is already added as an error
						const error = nodeErrors.find((e) =>
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
									await renderJSDocs(node, includeJsDoc, ecEngine, allowNonStandardJsDocTags),
								),
							);
						}
					}

					// Process the Twoslash Completion Annotations
					for (const node of nodeCompletions) {
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
										annotation.inlineRange.columnStart = processed.startCharacter;
									}
								}

								if (
									annotation.hover.start === processed.startCharacter &&
									annotation.hover.length === processed.length
								) {
									line.deleteAnnotation(annotation);
								}
							}

							line.addAnnotation(new TwoslashCompletionAnnotation(processed, node, line));
						}
					}

					// Process the Twoslash Custom Tags Annotations
					for (const node of nodeTags) {
						const line = codeBlock.getLine(node.line);

						if (line) {
							line.addAnnotation(new TwoslashCustomTagsAnnotation(node, line));
						}
					}
				});
			},
		},
	});
}
