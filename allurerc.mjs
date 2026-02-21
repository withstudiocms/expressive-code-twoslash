import { defineConfig } from "allure";

export default defineConfig({
	name: "Allure Report",
	output: "./allure-report",
	historyPath: "./history.jsonl",
	appendHistory: true,
	plugins: {
		awesome: {
			options: {
				reportName: "Awesome Report",
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
