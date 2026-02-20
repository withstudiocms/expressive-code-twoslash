// This file is used to create the popups for the twoslash code blocks
// It uses the floating-ui library to position the popup
// It also uses the MutationObserver to update the popups when the page changes
// It also listens for the astro:page-load event to update the popups when the page is loaded

function setupTooltip(ToolTip: Element, isMobileScreen: boolean) {
	let hoverAnnotation = ToolTip.nextElementSibling;

	// If not immediately after, search within the parent code block
	if (!hoverAnnotation || !hoverAnnotation.classList.contains("twoslash-popup-container")) {
		const codeBlock = ToolTip.closest(".expressive-code");
		if (codeBlock) {
			// Find all popup containers in this code block
			const allPopups = codeBlock.querySelectorAll(".twoslash-popup-container");
			const allHovers = codeBlock.querySelectorAll(".twoslash-hover");
			const hoverIndex = Array.from(allHovers).indexOf(ToolTip);
			hoverAnnotation = allPopups[hoverIndex];
		}
	}

	if (!hoverAnnotation) {
		console.warn("No popup container found for:", ToolTip);
		return;
	}

	const expressiveCodeBlock = ToolTip.closest(".expressive-code");

	if (!expressiveCodeBlock) {
		console.warn("No expressive-code container found for:", ToolTip);
		return;
	}

	// Ensure each tooltip has a unique ID for `aria-describedby`
	const randomId = `twoslash_popup_${[Math.random(), Date.now()]
		.map((n) => n.toString(36).substring(2, 10))
		.join("_")}`;

	// Set role and tabindex for accessibility
	hoverAnnotation?.setAttribute("role", "tooltip");
	hoverAnnotation?.setAttribute("tabindex", "-1");

	// Don't remove from parent - it needs to stay in the DOM structure
	// Just hide it initially
	(hoverAnnotation as HTMLElement).style.display = "none";

	// @ts-expect-error - We know this import works, but TypeScript may not be able to infer the types correctly from the minified module
	// biome-ignore lint/suspicious/noExplicitAny: Type assertion to avoid TypeScript errors with the imported module
	const floatingUiDom = FloatingUIDOM as any;

	// Helper function to update tooltip position
	function updatePosition() {
		if (!hoverAnnotation || hoverAnnotation === null) {
			console.warn("Twoslash popup container not found for tooltip:", ToolTip);
			return;
		}
		// restore original positioning context
		expressiveCodeBlock?.appendChild(hoverAnnotation);

		new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
			.then(() =>
				floatingUiDom.computePosition(ToolTip, hoverAnnotation, {
					placement: isMobileScreen ? "bottom" : "bottom-start",
					middleware: [
						floatingUiDom.size({
							apply({
								availableWidth,
								availableHeight,
							}: {
								availableWidth: number;
								availableHeight: number;
							}) {
								Object.assign((hoverAnnotation as HTMLElement).style, {
									maxWidth: `${Math.max(300, availableWidth)}px`,
									maxHeight: `${availableHeight}px`,
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
		ToolTip.querySelector(".twoslash-hover span")?.setAttribute("aria-describedby", randomId);
		hoverAnnotation?.setAttribute("id", randomId);
	}

	// Hide tooltip
	function hideTooltip() {
		hoverAnnotation?.setAttribute("aria-hidden", "true");
		hoverAnnotation?.removeAttribute("id");
		if (hoverAnnotation) {
			(hoverAnnotation as HTMLElement).style.display = "none";
			if (hoverAnnotation.parentNode === expressiveCodeBlock) {
				expressiveCodeBlock?.removeChild(hoverAnnotation);
			}
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
	// First, hide all existing tooltips to prevent duplicates
	for (const popup of container.querySelectorAll?.(".twoslash-popup-container") ?? []) {
		(popup as HTMLElement).style.display = "none";
		popup.setAttribute("aria-hidden", "true");
	}

	// Then, set up tooltips for all hover elements
	for (const el of container.querySelectorAll?.(".twoslash-hover") ?? []) {
		setupTooltip(el, isMobileScreen);
	}
}

initTwoslashPopups(document);

const newTwoslashPopupObserver = new MutationObserver((mutations) =>
	mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((node) => {
			initTwoslashPopups(node as HTMLElement);
		});
	}),
);

newTwoslashPopupObserver.observe(document.body, {
	childList: true,
	subtree: true,
});

// Handle Astro view transitions
document.addEventListener("astro:after-swap", () => {
	// Small delay to let the DOM settle after transition
	setTimeout(() => {
		initTwoslashPopups(document.body);
	}, 100);
});

// Handle initial page load
document.addEventListener("astro:page-load", () => {
	initTwoslashPopups(document.body);
});
