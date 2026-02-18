import { defineEcConfig } from "@astrojs/starlight/expressive-code";
import ectwoslash from "expressive-code-twoslash";
import shikiColorizedBrackets from "./plugins/shiki-color-brackets/index.js";

export default defineEcConfig({
	plugins: [ectwoslash()],
	shiki: {
		transformers: [shikiColorizedBrackets()],
	},
});
