import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Starlight",
			sidebar: [
				{
					label: "index",
					link: "/",
				},
			],
		}),
	],
});
