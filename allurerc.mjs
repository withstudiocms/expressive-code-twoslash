import { defineConfig } from "allure";

export default defineConfig({
	name: "Allure Report",
	output: "./allure-report",
	historyPath: "./history.jsonl",
	appendHistory: true,
	qualityGate: {
		rules: [
			{
				maxFailures: 0,
				fastFail: true,
			},
		],
	},
	plugins: {
		awesome: {
			options: {
				reportName: "Repository Tests",
				singleFile: false,
				reportLanguage: "en",
				open: false,
				publish: true,
				groupBy: ["parentSuite", "suite", "subSuite"],
			},
		},
		log: {
			options: {
				groupBy: "none",
			},
		},
	},
});
