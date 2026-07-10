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
 * Sección "En vivo" (live-glance) — rediseño.
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

// CTA "Trabajemos juntos": la insignia de flecha se eleva al pasar el mouse.
// Hook data-cta / data-cta-badge; lo usa el footer de coverflow-3d.astro.
function setupCta() {
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

// Coverflow 3D de la seccion Proyectos (home). Depende de los data-cf-*
// del componente coverflow-3d.astro y de position:sticky en .cf__stage.
// Reusa prefersReduced() e isCoarsePointer() ya definidos arriba.
function setupCoverflow() {
	const section = document.querySelector("[data-coverflow]");
	if (!section || section.__cfInit) return;
	section.__cfInit = true;

	const pin = section.querySelector("[data-cf-pin]");
	const stage = section.querySelector("[data-cf-stage]");
	const deck = section.querySelector("[data-cf-deck]");
	const cards = Array.from(section.querySelectorAll("[data-cf-card]"));
	const bignum = section.querySelector("[data-cf-bignum]");
	const counter = section.querySelector("[data-cf-counter]");
	const nameEl = section.querySelector("[data-cf-name]");
	const bar = section.querySelector("[data-cf-bar]");
	const dots = Array.from(section.querySelectorAll("[data-cf-dot]"));
	const hint = section.querySelector("[data-cf-hint]");
	if (!pin || !stage || !deck || !cards.length) return;

	const N = cards.length;
	const reduce = prefersReduced();
	const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
	const pad2 = (n) => (n < 10 ? "0" : "") + n;

	let mode = "";
	let vh = 0;
	let vw = 0;
	let STEP = 0;
	let CW = 0;
	let SPREAD = 0;
	let stride = 0;
	let active = -1;
	let curP = 0;

	// Si el usuario pidió menos movimiento: la CSS ya deja el deck en flujo
	// normal; no montamos scroll-jacking ni transforms 3D. Solo marcamos activo.
	if (reduce) {
		setActive(0);
		return;
	}

	function setActive(idx) {
		if (idx === active) return;
		active = idx;
		if (bignum) bignum.textContent = pad2(idx + 1);
		if (counter) counter.textContent = pad2(idx + 1) + " / " + pad2(N);
		if (nameEl) nameEl.textContent = cards[idx].getAttribute("data-title") || "";
		dots.forEach((d, i) => {
			const on = i === idx;
			d.style.width = on ? "22px" : "7px";
			d.style.background = on ? "var(--accent)" : "rgba(255,255,255,0.22)";
		});
	}

	function layout(p) {
		curP = p;
		const isMobile = mode === "mobile";
		for (let i = 0; i < N; i++) {
			const card = cards[i];
			const o = i - p;
			const ao = Math.abs(o);
			const rot = -clamp(o, -1, 1) * (isMobile ? 30 : 44);
			const depth = isMobile ? 70 : 150;
			const z = -Math.min(ao, 3) * depth;
			const sc = Math.max(isMobile ? 0.82 : 0.64, 1 - ao * 0.12);
			const op = ao > 3.4 ? 0 : Math.max(0, 1 - Math.max(0, ao - 1.15) * 0.5);
			let tf;
			if (isMobile) {
				tf =
					"translateZ(" + z.toFixed(1) + "px) rotateY(" + rot.toFixed(2) +
					"deg) scale(" + sc.toFixed(3) + ")";
			} else {
				const x = o * SPREAD;
				tf =
					"translate(-50%,-50%) translateX(" + x.toFixed(1) +
					"px) translateZ(" + z.toFixed(1) + "px) rotateY(" + rot.toFixed(2) +
					"deg) scale(" + sc.toFixed(3) + ")";
			}
			card.style.transform = tf;
			card.style.opacity = op.toFixed(3);
			card.style.zIndex = String(100 - Math.round(ao * 10));
			card.style.pointerEvents = op > 0.05 ? "auto" : "none";

			const scrim = card.querySelector("[data-cf-scrim]");
			if (scrim) scrim.style.opacity = clamp((ao - 0.12) * 0.62, 0, 0.68).toFixed(3);
			const isA = ao < 0.5;
			card.style.boxShadow = isA
				? "0 0 0 2px var(--accent), 0 46px 90px -34px rgba(0,0,0,0.85)"
				: "0 34px 70px -32px rgba(0,0,0,0.7)";
			const plus = card.querySelector("[data-cf-plus]");
			if (plus) {
				plus.style.transform = isA ? "rotate(90deg)" : "rotate(0deg)";
				plus.style.background = isA ? "var(--accent)" : "rgba(10,10,11,0.4)";
			}
			const cta = card.querySelector("[data-cf-cta]");
			if (cta) cta.style.opacity = isA ? "1" : "0";
		}
		setActive(clamp(Math.round(p), 0, N - 1));
	}

	/* ---- Desktop: scroll-jacking con position:sticky ----
	   El stage está sticky (CSS). Solo leemos cuánto se ha desplazado el pin y
	   mapeamos ese progreso a la posición del carrusel. Sin tocar position. */
	let ticking = false;
	function onWin() {
		if (mode !== "desktop" || ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			ticking = false;
			const total = pin.offsetHeight - vh; // distancia scrolleable del pin
			const scrolled = clamp(-pin.getBoundingClientRect().top, 0, total);
			const prog = total > 0 ? scrolled / total : 0;
			layout(prog * (N - 1));
			if (bar) bar.style.width = (prog * 100).toFixed(2) + "%";
			if (hint) hint.style.opacity = prog > 0.015 ? "0" : "1";
		});
	}

	/* ---- Móvil: scroll horizontal nativo con snap ---- */
	let mticking = false;
	function onDeck() {
		if (mode !== "mobile" || mticking) return;
		mticking = true;
		requestAnimationFrame(() => {
			mticking = false;
			const first = cards[0].offsetLeft + cards[0].offsetWidth / 2;
			const cur = deck.scrollLeft + deck.clientWidth / 2;
			const p = stride > 0 ? (cur - first) / stride : 0;
			layout(clamp(p, 0, N - 1));
			const maxSL = deck.scrollWidth - deck.clientWidth;
			const prog = maxSL > 0 ? deck.scrollLeft / maxSL : 0;
			if (bar) bar.style.width = (prog * 100).toFixed(2) + "%";
			if (hint) hint.style.opacity = deck.scrollLeft > 6 ? "0" : "1";
		});
	}

	function applyMode(m) {
		mode = m;
		if (m === "desktop") {
			pin.style.height = pin.__cfH + "px";
			cards.forEach((c) => {
				c.style.width = CW + "px";
			});
			onWin();
		} else {
			pin.style.height = "auto";
			// El ancho de tarjeta y el padding lateral los fija la CSS (@media).
			requestAnimationFrame(() => {
				stride = N > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : deck.clientWidth;
				onDeck();
			});
			onDeck();
		}
	}

	function measure() {
		vh = window.innerHeight || 800;
		vw = window.innerWidth || 1200;
		const coarse = isCoarsePointer();
		const m = vw <= 820 || (coarse && vw < 1024) ? "mobile" : "desktop";
		if (m === "desktop") {
			const availH = vh - 250;
			CW = Math.min(560, vw * 0.46);
			const maxByH = ((availH - 150) * 16) / 10;
			CW = Math.max(360, Math.min(CW, maxByH));
			SPREAD = CW * 0.6;
			STEP = Math.round(vh * 0.5); // "distancia" de scroll por tarjeta
			pin.__cfH = vh + STEP * (N - 1); // altura total del pin
		}
		applyMode(m);
	}

	function go(k) {
		k = clamp(k, 0, N - 1);
		if (mode === "desktop") {
			const pinTop = window.pageYOffset + pin.getBoundingClientRect().top;
			const y = Math.round(pinTop + k * STEP);
			// Lenis si está expuesto (ver README paso 4); si no, scroll nativo.
			if (window.lenis && typeof window.lenis.scrollTo === "function") {
				window.lenis.scrollTo(y);
			} else {
				window.scrollTo({ top: y, behavior: "smooth" });
			}
		} else {
			const target =
				cards[k].offsetLeft - (deck.clientWidth - cards[k].clientWidth) / 2;
			deck.scrollTo({ left: Math.max(0, Math.round(target)), behavior: "smooth" });
		}
	}

	// Click en tarjeta: si no es la activa, la centra; si lo es, abre el enlace.
	cards.forEach((card, idx) => {
		card.addEventListener("click", (e) => {
			if (idx !== active && mode === "desktop") {
				e.preventDefault();
				go(idx);
				return;
			}
			const href = card.getAttribute("href");
			if (!href || href === "#") e.preventDefault();
		});
	});

	const prev = section.querySelector("[data-cf-prev]");
	const next = section.querySelector("[data-cf-next]");
	if (prev) prev.addEventListener("click", () => go(active - 1));
	if (next) next.addEventListener("click", () => go(active + 1));
	dots.forEach((d, idx) => d.addEventListener("click", () => go(idx)));

	function onKey(e) {
		const r = section.getBoundingClientRect();
		if (r.bottom < 40 || r.top > vh - 40) return; // solo si está en pantalla
		if (e.key === "ArrowRight") {
			e.preventDefault();
			go(active + 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			go(active - 1);
		}
	}

	// Listeners (idempotentes: reemplaza cualquiera previo entre navegaciones).
	if (window.__jvCfWin) window.removeEventListener("scroll", window.__jvCfWin);
	if (window.__jvCfKey) window.removeEventListener("keydown", window.__jvCfKey);
	if (window.__jvCfResize) window.removeEventListener("resize", window.__jvCfResize);
	window.__jvCfWin = onWin;
	window.__jvCfKey = onKey;
	window.__jvCfResize = () => measure();
	window.addEventListener("scroll", window.__jvCfWin, { passive: true });
	deck.addEventListener("scroll", onDeck, { passive: true });
	window.addEventListener("keydown", window.__jvCfKey);
	window.addEventListener("resize", window.__jvCfResize, { passive: true });

	measure();
	window.addEventListener("load", () => measure(), { once: true });
	setTimeout(() => measure(), 500); // reintento tras cargar fuentes/imágenes
}

function init() {
	setupHeader();
	setupReveal();
	setupProjectFilters();
	startClock();
	setupCounters();
	setupTilt();
	setupCta();
	setupCoverflow();
}

// Si en el futuro se monta ClientRouter, este evento reinicializa tras cada swap
document.addEventListener("astro:page-load", init);

// Camino actual: init en cada carga completa de página
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
