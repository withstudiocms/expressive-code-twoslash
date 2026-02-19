import { css, toCSS, stylesheet } from "../dist/index.js";

/**
 * Base CSS styles
 */
const baseCSS = css({
	":root": {
		".main-pane": {
			"z-index": 1,
		},
		".expressive-code:hover .twoslash-hover:not(.twoslash-hover:hover)": {
			"border-color": `rgba(from var(--twoSlashhoverUnderlineColor) r g b / 0.4)`,
		},
	},
});

/**
 * Popup documentation styles
 */
const popupDocsCSS = css({
	"@media (min-width: 500px)": {
		".twoslash-popup-container:before": {
			content: '""',
			position: "absolute",
			top: "-5px",
			left: "3px",
			"border-top": `1px solid var(--twoSlashborderColor)`,
			"border-right": `1px solid var(--twoSlashborderColor)`,
			background: `var(--twoSlashbackground)`,
			transform: "rotate(-45deg)",
			width: "8px",
			height: "8px",
			"pointer-events": "none",
			display: "inline-block",
		},
	},
	".twoslash-popup-container": {
		position: "absolute",
		"z-index": "999 !important",
		background: "var(--twoSlashbackground) !important",
		border: `1px solid var(--twoSlashborderColor) !important`,
		"border-radius": "4px",
		"font-size": "90%",
		"white-space": "nowrap !important",
		"word-break": "normal !important",
		"overflow-wrap": "normal !important",
		width: "max-content !important",
		"margin-top": "0.5rem",
		color: "var(--twoSlashtextColor)",

		"a:link": {
			color: "var(--twoSlashlinkColor)",
		},
		"a:hover": {
			color: "var(--twoSlashlinkColorHover)",
		},
		"a:visited": {
			color: "var(--twoSlashlinkColorVisited)",
		},
		"a:active": {
			color: "var(--twoSlashlinkColorActive)",
		},
	},
});

/**
 * Static documentation container styles
 */
const staticDocsCSS = css({
	".twoslash-static-container": {
		display: "block",
		"z-index": 10,
		background: "var(--twoSlashbackground)",
		border: `1px solid var(--twoSlashborderColor)`,
		"border-radius": "4px",
		"font-size": "90%",
		"white-space": "nowrap !important",
		"word-break": "normal !important",
		"overflow-wrap": "normal !important",
		width: "max-content !important",

		"a:link": {
			color: "var(--twoSlashlinkColor)",
		},
		"a:hover": {
			color: "var(--twoSlashlinkColorHover)",
		},
		"a:visited": {
			color: "var(--twoSlashlinkColorVisited)",
		},
		"a:active": {
			color: "var(--twoSlashlinkColorActive)",
		},

		"&:before": {
			content: '""',
			position: "absolute",
			top: "-4px",
			left: "2px",
			"border-top": `1px solid var(--twoSlashborderColor)`,
			"border-right": `1px solid var(--twoSlashborderColor)`,
			background: `var(--twoSlashbackground)`,
			transform: "rotate(-45deg)",
			width: "10px",
			height: "10px",
			"pointer-events": "none",
			display: "inline-block",
		},

		"*": {
			"white-space": "wrap !important",
			"word-break": "normal !important",
			"overflow-wrap": "normal !important",
		},
	},
});

/**
 * Shared documentation styles
 */
const sharedDocsCSS = css({
	".twoslash, .twoslash-noline": {
		position: "relative",
	},
	"@media (prefers-reduced-motion: reduce)": {
		".twoslash *, .twoslash-noline *": {
			transition: "none !important",
		},
	},
	".twoslash .twoslash-hover": {
		position: "relative",
		"border-bottom": "1px dashed transparent",
		"transition-timing-function": "ease",
		transition: "border-color 0.3s",
	},
	".twoslash:hover .twoslash-hover": {
		"border-color": "var(--twoSlashhoverUnderlineColor)",
	},
	".twoslash-popup-code": {
		display: "block",
		width: "100%",
		"max-width": "600px",
		padding: "6px 12px",
		"font-size": "var(--codeFontSize)",
		"font-weight": 400,
		"line-height": "var(--codeLineHeight)",
		"white-space": "pre-wrap",

		"&, span": {
			"white-space": "preserve !important",
		},
	},
	".twoslash-popup-code-type": {
		"font-family": "var(--codeFontFamily)",
		"font-weight": 600,

		".frame pre": {
			display: "contents !important",
		},
		".frame .ec-line": {
			display: "unset !important",
			".code": {
				"padding-inline-start": "0 !important",
				"border-inline-start": "none !important",
			},
		},
		".frame pre > code": {
			padding: "0 !important",
		},
		".frame": {
			"box-shadow": "none !important",
		},
		".frame .header::before": {
			border: "none !important",
		},
	},
	".twoslash-popup-docs .frame": {
		"box-shadow": "none !important",
	},
	".twoslash-popup-code::-webkit-scrollbar, .twoslash-popup-code::-webkit-scrollbar-track, .twoslash-popup-docs::-webkit-scrollbar, .twoslash-popup-docs::-webkit-scrollbar-track":
		{
			"background-color": "inherit",
			"border-radius": `calc(var(--borderRadius) + var(--borderWidth))`,
			"border-top-left-radius": 0,
			"border-top-right-radius": 0,
		},
	".twoslash-popup-code::-webkit-scrollbar-thumb, .twoslash-popup-docs::-webkit-scrollbar-thumb": {
		"background-color": "var(--scrollbarThumbColor)",
		border: "4px solid transparent",
		"background-clip": "content-box",
		"border-radius": "10px",
	},
	".twoslash-popup-code::-webkit-scrollbar-thumb:hover, .twoslash-popup-docs::-webkit-scrollbar-thumb:hover":
		{
			"background-color": "var(--scrollbarThumbHoverColor)",
		},
	".twoslash-popup-code::-webkit-scrollbar-corner, .twoslash-popup-docs::-webkit-scrollbar-corner":
		{
			background: "transparent",
			width: 0,
			height: 0,
		},
	".twoslash-popup-code, .twoslash-popup-docs": {
		"max-height": "var(--twoSlash-popupDocsMaxHeight) !important",
		overflow: "auto !important",
	},
	".twoslash-popup-docs": {
		"max-width": "600px",
		"padding-left": "12px",
		"padding-right": "12px",
		"padding-top": "6px",
		"padding-bottom": "6px",
		"border-top": "1px solid var(--twoSlash-borderColor)",
		"font-size": "var(--codeFontSize)",
		"font-weight": 400,
		"line-height": "var(--codeLineHeight)",
		"text-wrap": "balance",

		code: {
			"font-family": "var(--codeFontFamily)",
			"font-weight": "var(--codeFontWeight)",
		},
	},
	".twoslash-popup-docs-tagline": {
		display: "flex",
		"text-wrap-style": "stable",
	},
	".twoslash-popup-docs-tag-name": {
		color: "var(--twoSlash-tagColor)",
		"font-style": "italic",
		"--shiki-dark-font-style": "italic",
		"font-weight": 500,
		"margin-right": "0.25rem",
	},
	".twoslash-popup-docs-tag-value": {
		"margin-left": "0.25rem",
	},
	".twoslash-popup-docs pre": {
		width: "100%",
		"background-color": "var(--ec-frm-edBg) !important",
		padding: ".15rem",
		"border-radius": "4px !important",
		position: "relative !important",
		"font-family": "var(--codeFontFamily)",
		display: "inline-block !important",
		"line-height": "var(--codeLineHeight)",
		border: `var(--ec-brdWd) solid var(--twoSlash-borderColor) !important`,
	},
	".twoslash-popup-docs.twoslash-popup-docs-tags": {
		"font-size": "14px !important",
		margin: "0 !important",
		"padding-top": "0 !important",
		"padding-bottom": "0 !important",
		"padding-left": "12px !important",
		"padding-right": "12px !important",
	},
	".twoslash-popup-docs > pre > code": {
		border: "none !important",
		outline: "none !important",
		width: "100% !important",
		padding: "0.15rem !important",
	},
	".twoslash-popup-docs code": {
		"background-color": "var(--ec-frm-edBg) !important",
		padding: ".125rem !important",
		"border-radius": "4px !important",
		position: "relative !important",
		display: "inline-block !important",
		"line-height": "var(--codeLineHeight)",
	},
	".twoslash-popup-docs-tag-value code, .twoslash-popup-docs > p > code, .twoslash-popup-docs > p > a > code, .twoslash-popup-docs > ul > li > code":
		{
			border: "1px solid var(--twoSlash-borderColor)",
			"border-radius": "4px",
		},
	".twoslash-popup-docs code span::after": {
		content: "none !important",
	},
});

/**
 * Completion/autocomplete styles
 */
const completionCSS = css({
	".twoslash .twoslash-completion": {
		position: "relative",
		"margin-top": "0.1rem",
	},
	".twoslash-completion-container": {
		display: "flex",
		"flex-direction": "column",
		"z-index": 10,
		background: "var(--twoSlash-completionBoxBackground)",
		border: "1px solid var(--twoSlash-completionBoxBorder)",
		"border-radius": "4px",
		"font-size": "90%",
		"white-space": "nowrap !important",
		"word-break": "normal !important",
		"overflow-wrap": "normal !important",
		width: "max-content !important",
		padding: "0.15rem",
		"padding-left": "0.25rem",
		"padding-right": "0.25rem",

		"*": {
			"white-space": "wrap !important",
			"word-break": "normal !important",
			"overflow-wrap": "normal !important",
		},
	},
	".twoslash-cursor": {
		content: '" "',
		width: "3px",
		height: "18px",
		"background-color": "var(--twoSlash-cursorColor)",
		display: "inline-block",
		"margin-left": "1px",
		animation: "cursor-blink 1.5s steps(2) infinite",
		"align-self": "center",
	},
	"@keyframes cursor-blink": {
		"0%": {
			opacity: 0,
		},
	},
	".twoslash-completion-item": {
		overflow: "hidden",
		display: "flex",
		"align-items": "center",
		gap: "0.25em",

		"&:hover": {
			background: "var(--twoSlash-completionBoxHoverBackground)",
		},
	},
	".twoslash-completion-item-separator": {
		"border-top": "1px solid var(--twoSlash-completionBoxBorder)",
	},
	".twoslash-completion-item-deprecated": {
		"text-decoration": "line-through",
		opacity: 0.5,
	},
	".twoslash-completion-name": {
		"font-weight": 400,
	},
	".twoslash-completion-name-unmatched": {
		color: "var(--twoSlash-completionBoxColor)",
	},
	".twoslash-completion-name-matched": {
		color: "var(--twoSlash-completionBoxMatchedColor)",
		"font-weight": 600,
	},
	".twoslash-completion-icon": {
		color: "var(--twoSlash-completionBoxColor)",
		"margin-right": "0.2rem",
		width: "1em",
		flex: "none",

		"&.class": {
			color: "var(--twoSlash-completionIconClass)",
		},
		"&.constructor": {
			color: "var(--twoSlash-completionIconConstructor)",
		},
		"&.function": {
			color: "var(--twoSlash-completionIconFunction)",
		},
		"&.interface": {
			color: "var(--twoSlash-completionIconInterface)",
		},
		"&.module": {
			color: "var(--twoSlash-completionIconModule)",
		},
		"&.method": {
			color: "var(--twoSlash-completionIconMethod)",
		},
		"&.property": {
			color: "var(--twoSlash-completionIconProperty)",
		},
		"&.string": {
			color: "var(--twoSlash-completionIconString)",
		},
	},
});

/**
 * Error display styles
 */
const errorCSS = css({
	".twoslash-noline .twoslash-static": {
		position: "relative",
	},
	".twoslash.twoerror": {
		display: "flex",
	},
	".twoslash-error-underline": {
		"text-decoration-line": "spelling-error",
		position: "relative",
	},
	".twoslash-error-box": {
		display: "flex",
		"z-index": 10,
		padding: "0.1rem 0.3rem",
		"border-radius": "0.2rem",
		"font-style": "italic",
		border: "1px solid var(--twoSlash-borderColor)",
		"font-size": "90%",
		"white-space": "nowrap !important",
		"word-break": "normal !important",
		"overflow-wrap": "normal !important",
		flex: "0 1 100%",

		".twoslash-error-box-icon, .twoslash-error-box-content": {
			display: "inline-block",
			"vertical-align": "middle",
		},
	},
	".twoslash-error-box-content": {
		flex: "0 1 100%",
	},
	".twoslash-error-box-content-message": {
		"white-space": "normal",
	},
	".twoslash-error-level-error": {
		color: "var(--twoSlash-errorColor) !important",
		"border-color": "rgba(from var(--twoSlash-errorColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-errorColor) r g b / 0.1) !important",
	},
	".twoslash-error-level-warning": {
		color: "var(--twoSlash-warnColor) !important",
		"border-color": "rgba(from var(--twoSlash-warnColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-warnColor) r g b / 0.1) !important",
	},
	".twoslash-error-level-suggestion": {
		color: "var(--twoSlash-suggestionColor) !important",
		"border-color": "rgba(from var(--twoSlash-suggestionColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-suggestionColor) r g b / 0.1) !important",
	},
	".twoslash-error-level-message": {
		color: "var(--twoSlash-messageColor) !important",
		"border-color": "rgba(from var(--twoSlash-messageColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-messageColor) r g b / 0.1) !important",
	},
});

/**
 * Custom tag styles
 */
const customTagCSS = css({
	".twoslash-custom-box": {
		"margin-left": "0rem",
		"margin-right": "0rem",
		"padding-left": "0.5rem",
		"padding-right": "0.5rem",
		display: "block",
		"z-index": 10,
		padding: "0.1rem 0.3rem",
		"border-radius": "0.2rem",
		"font-style": "italic",
		border: "1px solid var(--twoSlash-borderColor)",
		"font-size": "90%",
		"white-space": "nowrap !important",
		"word-break": "normal !important",
		"overflow-wrap": "normal !important",
		width: "100% !important",

		".twoslash-custom-box-icon, .twoslash-custom-box-content": {
			display: "inline-block",
			"vertical-align": "middle",
		},
		".twoslash-custom-box-icon": {
			"margin-right": "0.5rem",
			height: "1rem",
			width: "1rem",
		},
	},
	".twoslash-custom-level-error": {
		color: "var(--twoSlash-errorColor) !important",
		"border-color": "rgba(from var(--twoSlash-errorColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-errorColor) r g b / 0.1) !important",
	},
	".twoslash-custom-level-warning": {
		color: "var(--twoSlash-warnColor) !important",
		"border-color": "rgba(from var(--twoSlash-warnColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-warnColor) r g b / 0.1) !important",
	},
	".twoslash-custom-level-suggestion": {
		color: "var(--twoSlash-suggestionColor) !important",
		"border-color": "rgba(from var(--twoSlash-suggestionColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-suggestionColor) r g b / 0.1) !important",
	},
	".twoslash-custom-level-message": {
		color: "var(--twoSlash-messageColor) !important",
		"border-color": "rgba(from var(--twoSlash-messageColor) r g b / 0.25) !important",
		background: "rgba(from var(--twoSlash-messageColor) r g b / 0.1) !important",
	},
});

/**
 * Highlight styles
 */
const highlightCSS = css({
	".twoslash-highlighted": {
		"background-color": "var(--twoSlash-highlightBackground)",
		border: "1px solid var(--twoSlash-highlightBorderColor)",
		padding: "1px 2px",
		margin: "-1px -3px",
		"border-radius": "4px",
	},
});

/**
 * All styles combined as CSS objects
 */
export const styleObjects = {
	baseCSS,
	popupDocsCSS,
	staticDocsCSS,
	sharedDocsCSS,
	completionCSS,
	errorCSS,
	highlightCSS,
	customTagCSS,
};

/**
 * All styles combined and converted to a single CSS string
 */
export const allStyles = [
	baseCSS,
	popupDocsCSS,
	staticDocsCSS,
	sharedDocsCSS,
	completionCSS,
	errorCSS,
	highlightCSS,
	customTagCSS,
]
	.map((style) => toCSS(style))
	.join("\n\n");

/**
 * Export individual style strings
 */
export const styles = {
	base: toCSS(baseCSS),
	popupDocs: toCSS(popupDocsCSS),
	staticDocs: toCSS(staticDocsCSS),
	sharedDocs: toCSS(sharedDocsCSS),
	completion: toCSS(completionCSS),
	error: toCSS(errorCSS),
	highlight: toCSS(highlightCSS),
	customTag: toCSS(customTagCSS),
	all: allStyles,
};

export const stylesheetString = stylesheet(styleObjects);