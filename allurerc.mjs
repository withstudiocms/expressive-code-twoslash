import { defineConfig } from "allure";

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
		"css-js-gen": {
			import: "@allurereport/plugin-awesome",
			options: {
				reportName: "css-js-gen Tests",
				singleFile: false,
				reportLanguage: "en",
				open: false,
				publish: true,
				groupBy: ["parentSuite", "suite", "subSuite"],
				filter: ({ labels }) =>
					labels.find(({ name, value }) => name === "parentSuite" && value === "css-js-gen Tests"),
			},
		},
		log: {
			options: {
				groupBy: "none",
			},
		},
	},
});
