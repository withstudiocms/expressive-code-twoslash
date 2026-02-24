import { defineConfig } from "tsdown";
import { sharedConfig } from "../../../tsdown.shared.ts";

export default defineConfig({
	...sharedConfig,
	entry: ["./src/index.ts", "./src/core.ts", "./src/fallback.ts"],
	inlineOnly: ["ohash"],
});
