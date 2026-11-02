// Un único requestAnimationFrame para toda la página: Lenis avanza primero el scroll
// y después pintan el motor 3D y la tipografía del hero, así los planos WebGL y el
// DOM usan el mismo scrollY en cada frame. El navegador ya lo pausa en pestañas ocultas.
const subs = [];
let raf = 0;

function tick(t) {
  raf = requestAnimationFrame(tick);
  for (let i = 0; i < subs.length; i++) subs[i].fn(t);
}

/** Registra `fn(t)` en el bucle. Menor `order` = antes (Lenis usa -10). Devuelve la baja. */
export function onFrame(fn, order = 0) {
  const sub = { fn, order };
  subs.push(sub);
  subs.sort((a, b) => a.order - b.order);
  if (!raf) raf = requestAnimationFrame(tick);
  return () => {
    const i = subs.indexOf(sub);
    if (i >= 0) subs.splice(i, 1);
    if (!subs.length) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
