import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// Define the Site URL
const site = process.env.DOKPLOY_DEPLOY_URL
	? `https://${process.env.DOKPLOY_DEPLOY_URL}`
	: "https://twoslash.studiocms.dev/";

const ogImageUrl = new URL("/og.png", site).href;

// https://astro.build/config
export default defineConfig({
	site,
	markdown: {
		syntaxHighlight: false,
	},
	integrations: [
		starlight({
			title: "Expressive Code Twoslash",
			description:
				"A Expressive Code plugin that adds Twoslash support to your Expressive Code TypeScript code blocks.",
			tagline:
				"A Expressive Code plugin that adds Twoslash support to your Expressive Code TypeScript code blocks.",
			logo: {
				src: "./src/assets/twoslash.png",
				alt: "EC Twoslash Logo",
			},
			credits: true,
			components: {
				PageTitle: "./src/components/starlight/PageTitle.astro",
			},
			social: [
				{
					label: "GitHub",
					href: "https://github.com/withstudiocms/express-code-twoslash/",
					icon: "github",
				},
				{
					label: "Discord",
					href: "https://chat.studiocms.dev",
					icon: "discord",
				},
				{
					label: "X",
					href: "https://x.com/withstudiocms",
					icon: "x.com",
				},
				{
					label: "BlueSky",
					href: "https://bsky.app/profile/studiocms.dev",
					icon: "blueSky",
				},
				{
					label: "Open Collective",
					href: "https://opencollective.com/studiocms",
					icon: "openCollective",
				},
			],
			editLink: {
				baseUrl: "https://github.com/withstudiocms/express-code-twoslash/edit/main/docs/",
			},
			customCss: ["./src/styles/starlight.css"],
			head: [
				// Analytics Script - Only include in production
				...(process.env.NODE_ENV === "production"
					? [
							{
								tag: "script" as const,
								attrs: {
									src: "https://analytics.studiocms.cloud/script.js",
									"data-website-id": "c6b56a8f-f4d1-4a52-b318-93c9cb442c9c",
									defer: true,
								},
							},
						]
					: []),

				// Favicon Meta Tags
				{
					tag: "link",
					attrs: {
						type: "image/png",
						rel: "icon",
						href: "/favicon-96x96.png",
						sizes: "96x96",
					},
				},
				{
					tag: "link",
					attrs: {
						type: "image/svg+xml",
						rel: "icon",
						href: "/favicon.svg",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "shortcut icon",
						href: "/favicon.ico",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "apple-touch-icon",
						href: "/apple-touch-icon.png",
						sizes: "180x180",
					},
				},
				{
					tag: "meta",
					attrs: {
						name: "apple-mobile-web-app-title",
						content: "EC Twoslash",
					},
				},
				{
					tag: "meta",
					attrs: {
						name: "theme-color",
						content: "#13dcef",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "manifest",
						href: "/site.webmanifest",
					},
				},

				// Open Graph Meta Tags
				{
					tag: "meta",
					attrs: {
						property: "og:image",
						content: ogImageUrl,
					},
				},

				// Twitter Card Meta Tags
				{
					tag: "meta",
					attrs: {
						name: "twitter:title",
						content: "Expressive Code Twoslash",
					},
				},
				{
					tag: "meta",
					attrs: {
						name: "twitter:description",
						content: "A plugin for Astro that adds Twoslash support to code blocks.",
					},
				},
				{
					tag: "meta",
					attrs: {
						name: "twitter:image",
						content: ogImageUrl,
					},
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					autogenerate: { directory: "getting-started" },
				},
				{
					label: "Available Twoslashers",
					autogenerate: { directory: "twoslashers" },
				},
				{
					label: "Usage",
					items: [
						{
							label: "Code Queries",
							autogenerate: { directory: "usage/queries" },
						},
						{
							label: "Banners",
							autogenerate: { directory: "usage/banners" },
						},
						{
							label: "Code Cutting",
							link: "usage/code-cutting",
						},
						{
							label: "Overriding Compiler Options",
							link: "usage/ts-compiler-flags",
						},
						{
							label: "External Types",
							link: "usage/external-types",
						},
						{
							label: "Show Emitted Files",
							link: "usage/show-emitted-files",
						},
					],
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
