// This file is used to create the popups for the twoslash code blocks
// It uses the floating-ui library to position the popup
// It also uses the MutationObserver to update the popups when the page changes
// It also listens for the astro:page-load event to update the popups when the page is loaded

function setupTooltip(ToolTip: Element, isMobileScreen: boolean) {
	const hoverAnnotation = ToolTip.querySelector(".twoslash-popup-container");
	const expressiveCodeBlock = hoverAnnotation?.closest(".expressive-code");

	// Ensure each tooltip has a unique ID for `aria-describedby`
	const randomId = `twoslash_popup_${[Math.random(), Date.now()].map((n) => n.toString(36).substring(2, 10)).join("_")}`;

	// Set role and tabindex for accessibility
	hoverAnnotation?.setAttribute("role", "tooltip");
	hoverAnnotation?.setAttribute("tabindex", "-1");

	if (hoverAnnotation?.parentNode) {
		hoverAnnotation.parentNode.removeChild(hoverAnnotation);
	}

	// @ts-expect-error - We know this import works, but TypeScript may not be able to infer the types correctly from the minified module
	const floatingUiDom = FloatingUIDOM as any; // Type assertion to avoid TypeScript errors with the imported module

	// Helper function to update tooltip position
	function updatePosition() {
		if (!hoverAnnotation || hoverAnnotation === null) {
			console.warn("Twoslash popup container not found for tooltip:", ToolTip);
			return;
		}
		// Ensure `hoverAnnotation` remains attached to the expressiveCodeBlock for each tooltip
		expressiveCodeBlock?.appendChild(hoverAnnotation);

		new Promise((resolve) =>
			requestAnimationFrame(() => {
				requestAnimationFrame(resolve);
			}),
		)
			.then(() =>
				floatingUiDom.computePosition(ToolTip, hoverAnnotation, {
					placement: isMobileScreen ? "bottom" : "bottom-start",
					middleware: [
						floatingUiDom.size({
							apply({ availableWidth }: { availableWidth: number }) {
								Object.assign((hoverAnnotation as HTMLElement).style, {
									maxWidth: `${Math.max(300, availableWidth)}px`,
									maxHeight: "100%",
								});
							},
						}),
					],
				}),
			)
			.then(({ x, y }) => {
				Object.assign((hoverAnnotation as HTMLElement).style, {
					display: "block",
					left: `${isMobileScreen ? 20 : x}px`,
					top: `${y}px`,
				});
			});
	}

	let isMouseOverTooltip = false;
	let hideTimeout: ReturnType<typeof setTimeout>;
	const TimeoutDelay = 100; // ms

	// Show tooltip
	function showTooltip() {
		clearTimeout(hideTimeout);
		updatePosition();
		hoverAnnotation?.setAttribute("aria-hidden", "false");
		ToolTip.querySelector(".twoslash-hover span")?.setAttribute(
			"aria-describedby",
			randomId,
		);
		hoverAnnotation?.setAttribute("id", randomId);
	}

	// Hide tooltip
	function hideTooltip() {
		hoverAnnotation?.setAttribute("aria-hidden", "true");
		ToolTip.querySelector(".twoslash-hover span")?.removeAttribute(
			"aria-describedby",
		);
		hoverAnnotation?.removeAttribute("id");
		if (hoverAnnotation) {
			(hoverAnnotation as HTMLElement).style.display = "none"; // Hide instead of removing from DOM
		}
	}

	// Event listeners for both mouse and keyboard accessibility
	ToolTip.addEventListener("mouseenter", showTooltip);
	ToolTip.addEventListener("mouseleave", () => {
		hideTimeout = setTimeout(() => {
			if (!isMouseOverTooltip) hideTooltip();
		}, TimeoutDelay);
	});

	hoverAnnotation?.addEventListener("mouseenter", () => {
		clearTimeout(hideTimeout);
		isMouseOverTooltip = true;
	});

	hoverAnnotation?.addEventListener("mouseleave", () => {
		isMouseOverTooltip = false;
		hideTimeout = setTimeout(() => {
			if (!ToolTip.matches(":hover")) hideTooltip();
		}, TimeoutDelay);
	});

	ToolTip.addEventListener("focus", showTooltip);
	ToolTip.addEventListener("blur", hideTooltip);

	// Initial hide for tooltip
	hideTooltip();
}

const isMobileScreen = window.matchMedia("(max-width: 500px)").matches;

function initTwoslashPopups(container: HTMLElement | Document) {
	container.querySelectorAll?.(".twoslash-hover").forEach((el) => {
		setupTooltip(el, isMobileScreen);
	});
}

initTwoslashPopups(document);

const newTwoslashPopupObserver = new MutationObserver((mutations) =>
	mutations.forEach((mutation) =>
		mutation.addedNodes.forEach((node) => {
			initTwoslashPopups(node as HTMLElement);
		}),
	),
);

newTwoslashPopupObserver.observe(document.body, {
	childList: true,
	subtree: true,
});

document.addEventListener("astro:page-load", () => {
	initTwoslashPopups(document.body);
});
