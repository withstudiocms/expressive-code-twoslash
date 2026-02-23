import { defineProject, mergeConfig } from "vitest/config";
import { configShared } from "../../../vitest.shared.js";

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			name: "@ec-ts/vfs",
			include: ["**/*.test.ts"],
		},
	}),
);
