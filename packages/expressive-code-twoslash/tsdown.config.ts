import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["esm"],
	dts: {
		build: true,
	},
	outExtensions: () => ({
		js: ".js",
		dts: ".d.ts",
	}),
});
