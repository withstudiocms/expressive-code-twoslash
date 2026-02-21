import * as os from "node:os";
import { defineConfig } from "vitest/config";

/**
 * Array describing groups of projects that have tests.
 *
 * Each entry in the array represents a logical grouping of package names:
 * - scope?: Optional npm scope (without the leading '@'). When present, package names
 *   in `names` are intended to be resolved as `@{scope}/{name}`.
 * - names: Required array of package names (strings) that belong to the group.
 *
 * Purpose:
 * - Used to enumerate packages for which tests should be run, in the order provided.
 * - Consumers typically map each entry to concrete package identifiers (e.g. prefixing
 *   names with `@${scope}/` when `scope` is present) and then trigger test runs.
 *
 * Constraints and expectations:
 * - `scope` should be the raw scope identifier (e.g. "studiocms"), not including the '@'.
 * - Each `names` array should contain at least one non-empty string.
 * - Avoid duplicate full package identifiers across entries to prevent redundant test execution.
 *
 * Usage notes:
 * - To construct a full package name: scope ? `@${scope}/${name}` : `${name}`.
 * - The array's order may be significant for orchestration, reporting, or batching of test runs.
 *
 * Extensibility:
 * - Add additional group objects to include more packages.
 * - To represent a top-level package without a scope, supply an object with only `names`.
 */
const projectsWithTests: { scope?: string; names: string[] }[] = [
	{
		names: ["css-js-gen"],
	},
];

export default defineConfig({
	test: {
		projects: projectsWithTests.flatMap(({ scope, names }) =>
			scope
				? names.map((name) => `packages/@${scope}/${name}`)
				: names.map((name) => `packages/${name}`),
		),
		setupFiles: ["allure-vitest/setup"],
		reporters: [
			"default",
			[
				"junit",
				{
					outputFile: "./junit-report.xml",
				},
			],
			[
				"allure-vitest/reporter",
				{
					resultsDir: "allure-results",
					links: {
						issue: {
							nameTemplate: "Issue #%s",
							urlTemplate: "https://github.com/withstudiocms/expressive-code-twoslash/issues/%s",
						},
					},
					environmentInfo: {
						os_platform: os.platform(),
						os_release: os.release(),
						os_version: os.version(),
						node_version: process.version,
					},
					globalLabels: {
						owner: "withstudiocms",
						lead: "Adam Matthiesen",
						framework: "Vitest",
						language: "TypeScript/JavaScript",
					},
				},
			],
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json"],
			exclude: [
				"scripts/**",
				"playground/**",
				"knip.config.ts",
				".github/**",
				"vitest.config.ts",
				"**/**/vitest.config.ts",
				"**/**/scratchpad/**",
				"**/**/test/fixtures/**",
				"**/**/test/test-utils.ts",
				"**/**/test/test-utils.js",
				"**/dist/**",
			],
		},
	},
});
