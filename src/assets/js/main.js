// Interacciones del rediseño: menú móvil del header + reveal on scroll.
// La navegación es por carga completa (no hay ClientRouter montado), así que el
// init corre en cada carga vía el fallback de más abajo. El listener de
// astro:page-load se mantiene por si se habilitan View Transitions en el futuro.

let revealObserver = null;

function setupHeader() {
	const toggle = document.getElementById("jvMenuToggle");
	const nav = document.getElementById("jvNav");
	if (!toggle || !nav) return;

	const close = () => {
		nav.classList.remove("is-open");
		toggle.setAttribute("aria-expanded", "false");
	};
	const open = () => {
		nav.classList.add("is-open");
		toggle.setAttribute("aria-expanded", "true");
	};

	// onclick reemplaza el handler anterior (idempotente entre navegaciones)
	toggle.onclick = (e) => {
		e.stopPropagation();
		nav.classList.contains("is-open") ? close() : open();
	};

	nav.querySelectorAll("a").forEach((a) => {
		a.onclick = () => close();
	});

	if (window.__jvHeaderDocClick) {
		document.removeEventListener("click", window.__jvHeaderDocClick);
	}
	window.__jvHeaderDocClick = (e) => {
		if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
	};
	document.addEventListener("click", window.__jvHeaderDocClick);

	if (window.__jvHeaderEsc) {
		document.removeEventListener("keydown", window.__jvHeaderEsc);
	}
	window.__jvHeaderEsc = (e) => {
		if (e.key === "Escape") close();
	};
	document.addEventListener("keydown", window.__jvHeaderEsc);
}

function setupReveal() {
	const els = Array.from(document.querySelectorAll("[data-reveal]"));
	if (!els.length) return;

	if (revealObserver) revealObserver.disconnect();

	const reduce = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (reduce) {
		els.forEach((el) => el.classList.add("is-visible"));
		return;
	}

	els.forEach((el) => el.classList.remove("is-visible"));

	const vh = window.innerHeight || 800;

	revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
	);

	els.forEach((el, idx) => {
		const top = el.getBoundingClientRect().top;
		if (top < vh * 0.92) {
			// ya visible: revelar con un pequeño stagger
			setTimeout(() => el.classList.add("is-visible"), 60 + idx * 70);
		} else {
			revealObserver.observe(el);
		}
	});

	// red de seguridad: nunca dejar nada oculto
	setTimeout(() => els.forEach((el) => el.classList.add("is-visible")), 1800);
}

function setupProjectFilters() {
	const chips = Array.from(document.querySelectorAll("[data-filter]"));
	if (!chips.length) return;
	const cards = Array.from(document.querySelectorAll("[data-proj][data-cat]"));
	const empty = document.querySelector("[data-empty]");

	const apply = (filter) => {
		chips.forEach((c) =>
			c.classList.toggle("is-active", c.getAttribute("data-filter") === filter),
		);
		let visible = 0;
		cards.forEach((card) => {
			const match =
				filter === "todos" || card.getAttribute("data-cat") === filter;
			card.style.display = match ? "" : "none";
			if (match) {
				visible++;
				card.classList.add("is-visible");
			}
		});
		if (empty) empty.style.display = visible === 0 ? "block" : "none";
	};

	chips.forEach((c) => {
		c.onclick = () => apply(c.getAttribute("data-filter"));
	});
}

function init() {
	setupHeader();
	setupReveal();
	setupProjectFilters();
}

// Si en el futuro se monta ClientRouter, este evento reinicializa tras cada swap
document.addEventListener("astro:page-load", init);

// Camino actual: init en cada carga completa de página
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
