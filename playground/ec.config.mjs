import { defineEcConfig } from "@astrojs/starlight/expressive-code";
import ectwoslash from "expressive-code-twoslash";

export default defineEcConfig({
	plugins: [ectwoslash()],
});
