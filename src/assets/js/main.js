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
		chips.forEach((c) => {
			const on = c.getAttribute("data-filter") === filter;
			c.classList.toggle("is-active", on);
			c.setAttribute("aria-pressed", on ? "true" : "false");
		});
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

/* =============================================================================
 * Secciones "En vivo" (live-glance) y "Proyectos" (projects-grid) — rediseño.
 * Port a JS vanilla del prototipo. Depende de los atributos data-* del markup
 * y de la CSS var --accent. El reveal lo maneja setupReveal() de arriba.
 * ========================================================================== */
const prefersReduced = () =>
	window.matchMedia &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = () =>
	window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

// Reloj en vivo — Cajamarca / America/Lima (GMT-5), 24h.
function startClock() {
	const clk = document.querySelector("[data-clock]");
	const dt = document.querySelector("[data-date]");
	if (!clk && !dt) return;

	const locale = document.documentElement.lang === "en" ? "en-GB" : "es-PE";
	const tick = () => {
		const now = new Date();
		if (clk) {
			clk.textContent = new Intl.DateTimeFormat(locale, {
				timeZone: "America/Lima",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			}).format(now);
		}
		if (dt) {
			const s = new Intl.DateTimeFormat(locale, {
				timeZone: "America/Lima",
				weekday: "long",
				day: "2-digit",
				month: "long",
				year: "numeric",
			}).format(now);
			dt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
		}
	};

	tick();
	if (window.__jvClock) clearInterval(window.__jvClock);
	window.__jvClock = setInterval(tick, 1000);
}

// Contadores animados — cuentan de 0 al valor al entrar en viewport.
function setupCounters() {
	const els = Array.from(document.querySelectorAll("[data-counter]"));
	if (!els.length) return;
	const reduce = prefersReduced();

	const run = (el) => {
		const target = parseFloat(el.getAttribute("data-target")) || 0;
		const suffix = el.getAttribute("data-suffix") || "";
		if (reduce) {
			el.textContent = Math.round(target) + suffix;
			el.dataset.done = "1";
			return;
		}
		const dur = 1400;
		const t0 = performance.now();
		const ease = (t) => 1 - Math.pow(1 - t, 3);
		const step = (now) => {
			const p = Math.min(1, (now - t0) / dur);
			el.textContent = Math.round(target * ease(p)) + (p >= 1 ? suffix : "");
			if (p < 1) requestAnimationFrame(step);
			else el.dataset.done = "1";
		};
		requestAnimationFrame(step);
	};

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					run(e.target);
					io.unobserve(e.target);
				}
			});
		},
		{ threshold: 0.6 },
	);
	els.forEach((el) => {
		if (el.dataset.done) return;
		io.observe(el);
	});
}

// Tilt 3D + brillo que sigue al cursor (tarjeta oscura + CV). Solo puntero fino.
function setupTilt() {
	if (isCoarsePointer() || prefersReduced()) return;
	document.querySelectorAll("[data-tilt]").forEach((el) => {
		if (el.__jvTilt) return;
		el.__jvTilt = true;
		const strength = parseFloat(el.getAttribute("data-tilt")) || 6;
		const glowColor =
			el.getAttribute("data-glow-color") || "rgba(255,255,255,0.16)";
		const glow = el.querySelector("[data-glow]");
		el.style.transition =
			"transform .16s ease-out, opacity .6s ease, box-shadow .25s ease";
		el.addEventListener("mousemove", (e) => {
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width;
			const py = (e.clientY - r.top) / r.height;
			el.style.transform =
				"perspective(820px) rotateX(" +
				((0.5 - py) * strength * 2).toFixed(2) +
				"deg) rotateY(" +
				((px - 0.5) * strength * 2).toFixed(2) +
				"deg) translateY(-2px)";
			el.style.boxShadow = "0 26px 50px -28px rgba(20,30,80,0.4)";
			if (glow) {
				glow.style.opacity = "1";
				glow.style.background =
					"radial-gradient(340px circle at " +
					(px * 100).toFixed(1) +
					"% " +
					(py * 100).toFixed(1) +
					"%, " +
					glowColor +
					", transparent 62%)";
			}
		});
		el.addEventListener("mouseleave", () => {
			el.style.transform = "";
			el.style.boxShadow = "";
			if (glow) glow.style.opacity = "0";
		});
	});
}

// Tarjetas de proyecto: pixel-dissolve (12×8) + cuadros magnéticos + CTA.
function setupProjects() {
	const cards = Array.from(document.querySelectorAll("[data-proj-card]"));
	if (cards.length) {
		const COLS = 12;
		const ROWS = 8;
		const coarse = isCoarsePointer();
		// posiciones de los cuadros magnéticos por tarjeta: [x%, y%, tamaño px]
		const MAG = [
			[[5, 30, 16], [10, 42, 10], [3, 52, 7], [80, 70, 14], [85, 82, 9], [78, 60, 6]],
			[[82, 55, 16], [88, 68, 10], [78, 72, 7], [85, 42, 6], [90, 80, 8]],
			[[4, 24, 16], [10, 36, 10], [2, 44, 7], [78, 78, 14], [84, 88, 8]],
			[[82, 26, 14], [88, 38, 10], [78, 44, 7], [84, 54, 5], [90, 60, 8]],
			[[6, 26, 15], [12, 38, 9], [4, 48, 7], [82, 72, 13], [88, 84, 8], [80, 62, 6]],
			[[84, 52, 15], [90, 66, 10], [80, 70, 7], [86, 40, 6], [92, 78, 8]],
		];

		cards.forEach((card, idx) => {
			if (card.__jvProj) return;
			card.__jvProj = true;

			// 1) rejilla de bloques para el pixel-dissolve
			const pen = card.querySelector("[data-pixels]");
			const blocks = [];
			if (pen && !pen.childElementCount) {
				const frag = document.createDocumentFragment();
				for (let r = 0; r < ROWS; r++) {
					for (let c = 0; c < COLS; c++) {
						const b = document.createElement("div");
						b.style.cssText =
							"position:absolute;left:" +
							(c * 100) / COLS +
							"%;top:" +
							(r * 100) / ROWS +
							"%;width:" +
							(100 / COLS + 0.4) +
							"%;height:" +
							(100 / ROWS + 0.4) +
							"%;background:#0a0a0b;opacity:0;transform:scale(0);transform-origin:center;transition:transform .25s ease,opacity .25s ease;";
						b._din = (r + c) * 0.018; // retardo diagonal al entrar
						b._dout = (ROWS - r + (COLS - c)) * 0.012; // retardo al salir
						frag.appendChild(b);
						blocks.push(b);
					}
				}
				pen.appendChild(frag);
			}

			// 2) cuadros magnéticos
			const men = card.querySelector("[data-magnets]");
			const mags = [];
			if (men && !men.childElementCount) {
				MAG[idx % MAG.length].forEach((s, j) => {
					const el = document.createElement("div");
					const accent = j % 3 === 0;
					el.style.cssText =
						"position:absolute;left:" +
						s[0] +
						"%;top:" +
						s[1] +
						"%;width:" +
						s[2] +
						"px;height:" +
						s[2] +
						"px;background:" +
						(accent ? "var(--accent)" : "#0a0a0b") +
						";opacity:" +
						(accent ? 0.92 : 0.7) +
						";border-radius:2px;transition:transform .35s cubic-bezier(.2,.8,.2,1);pointer-events:none;will-change:transform;";
					el._f = 0.5 + s[2] / 16; // los más grandes se mueven más
					men.appendChild(el);
					mags.push(el);
				});
			}

			const hover = card.querySelector("[data-hover]");
			const enter = () => {
				blocks.forEach((b) => {
					b.style.transitionDelay = b._din + "s";
					b.style.opacity = "0.86";
					b.style.transform = "scale(1)";
				});
				if (hover) hover.style.opacity = "1";
			};
			const leave = () => {
				blocks.forEach((b) => {
					b.style.transitionDelay = b._dout + "s";
					b.style.opacity = "0";
					b.style.transform = "scale(0)";
				});
				if (hover) hover.style.opacity = "0";
				mags.forEach((m) => {
					m.style.transform = "translate(0,0)";
				});
			};
			card.addEventListener("mouseenter", enter);
			card.addEventListener("mouseleave", leave);
			// Surface the tags/CTA overlay for keyboard users too.
			card.addEventListener("focus", enter);
			card.addEventListener("blur", leave);
			if (!coarse && !prefersReduced()) {
				card.addEventListener("mousemove", (e) => {
					const r = card.getBoundingClientRect();
					const px = (e.clientX - r.left) / r.width - 0.5;
					const py = (e.clientY - r.top) / r.height - 0.5;
					mags.forEach((m) => {
						m.style.transform =
							"translate(" +
							(px * 40 * m._f).toFixed(1) +
							"px," +
							(py * 40 * m._f).toFixed(1) +
							"px)";
					});
				});
			}
		});
	}

	// CTA "Trabajemos juntos": la insignia de flecha se eleva al pasar el mouse.
	const cta = document.querySelector("[data-cta]");
	const badge = document.querySelector("[data-cta-badge]");
	if (cta && badge && !cta.__jvCta) {
		cta.__jvCta = true;
		cta.addEventListener("mouseenter", () => {
			badge.style.marginBottom = "10px";
		});
		cta.addEventListener("mouseleave", () => {
			badge.style.marginBottom = "0px";
		});
	}
}

// Parallax de los cuadros flotantes del encabezado de Proyectos.
function setupParallax() {
	const sec = document.querySelector("[data-projects]");
	const squares = Array.from(document.querySelectorAll("[data-sq]"));
	if (!sec || !squares.length) return;
	if (prefersReduced()) return;

	let ticking = false;
	const update = () => {
		ticking = false;
		const r = sec.getBoundingClientRect();
		const vh = window.innerHeight || 800;
		const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
		squares.forEach((sq) => {
			const depth = parseFloat(sq.getAttribute("data-depth")) || 120;
			sq.style.transform = "translateY(" + (p * -depth).toFixed(1) + "px)";
		});
	};
	const onScroll = () => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	};
	update();
	// Re-init safe: replace any prior listener instead of stacking one.
	if (window.__jvParallaxScroll) {
		window.removeEventListener("scroll", window.__jvParallaxScroll);
	}
	window.__jvParallaxScroll = onScroll;
	window.addEventListener("scroll", onScroll, { passive: true });
}

function init() {
	setupHeader();
	setupReveal();
	setupProjectFilters();
	startClock();
	setupCounters();
	setupTilt();
	setupProjects();
	setupParallax();
}

// Si en el futuro se monta ClientRouter, este evento reinicializa tras cada swap
document.addEventListener("astro:page-load", init);

// Camino actual: init en cada carga completa de página
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
