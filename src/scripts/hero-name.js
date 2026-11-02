// Tipografía variable reactiva del nombre del hero (README §7.1).
// Markup: <h1 id="hero-name" aria-label="Jairo Vera"><span aria-hidden="true"><span data-l>J</span>…</span>…</h1>
import { onFrame } from "./frame-loop.js";

export function initHeroName(root = document.getElementById("hero-name")) {
  if (!root) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const letters = [...root.querySelectorAll("[data-l]")].map((el) => ({ el, w: 90, g: 760, cx: 0 }));
  const mouse = { x: -9999, y: -9999 };
  const onMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  // Los centros de cada letra solo cambian al redimensionar o al cambiar el ancho de
  // las vecinas; medirlos cada 4 frames basta y evita 9 layouts por frame.
  let frame = 0;
  const off = onFrame((t) => {
    const rr = root.getBoundingClientRect();
    if (rr.bottom < 0 || rr.top > window.innerHeight) return;
    if (frame++ % 4 === 0) for (const L of letters) { const r = L.el.getBoundingClientRect(); L.cx = r.left + r.width / 2; }
    const near = !coarse && mouse.y > rr.top - 160 && mouse.y < rr.bottom + 160;
    for (const L of letters) {
      const f = near ? Math.exp(-Math.pow((mouse.x - L.cx) / 210, 2)) : 0.18 + 0.18 * Math.sin(t / 1100 + L.cx / 140);
      L.w += (80 + 45 * f - L.w) * 0.1;
      L.g += (640 + 260 * f - L.g) * 0.1;
      L.el.style.fontVariationSettings = `'wdth' ${L.w.toFixed(1)}, 'wght' ${L.g.toFixed(0)}`;
    }
  });
  return () => {
    off();
    window.removeEventListener("pointermove", onMove);
  };
}
