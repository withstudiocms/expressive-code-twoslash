import { defineConfig } from "allure";

// These are the packages that have tests and should be included in the Allure report. The report will be grouped by parentSuite, suite, and subSuite, and will only include tests that have a label with name "parentSuite" and value `${pkg} Tests`.
const packagesWithTests = ["css-js-gen", "@ec-ts/twoslash", "@ec-ts/vfs"];

// Create a plugins configuration object for each package with tests, using the @allurereport/plugin-awesome plugin. The report will be named `${pkg} Tests`, and will be published to the Allure server.
const pluginsConfig = Object.fromEntries(
	packagesWithTests.map((pkg) => [
		pkg,
		{
			import: "@allurereport/plugin-awesome",
			options: {
				reportName: `${pkg} Tests`,
				singleFile: false,
				reportLanguage: "en",
				open: false,
				publish: true,
				groupBy: ["parentSuite", "suite", "subSuite"],
				filter: ({ labels }) =>
					labels.find(({ name, value }) => name === "parentSuite" && value === `${pkg} Tests`),
			},
		},
	]),
);

// Export the Allure configuration object, which includes the plugins configuration for each package with tests, as well as some general settings for the Allure report.
export default defineConfig({
	name: "Allure Report",
	output: "./allure-report",
	historyPath: "./test-history/history.jsonl",
	appendHistory: true,
	historyLimit: 20,
	qualityGate: {
		rules: [
			{
				maxFailures: 0,
				fastFail: true,
			},
		],
	},
	plugins: {
		...pluginsConfig,
		log: {
			options: {
				groupBy: "none",
			},
		},
	},
});
