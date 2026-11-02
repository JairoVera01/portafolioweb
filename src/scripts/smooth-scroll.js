// Lenis sobre el bucle compartido. Con movimiento reducido se queda el scroll nativo.
import Lenis from "lenis";
import { onFrame } from "./frame-loop.js";

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const lenis = new Lenis({
    autoRaf: false,
    anchors: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  onFrame((t) => lenis.raf(t), -10);
  window.lenis = lenis;
  return lenis;
}
