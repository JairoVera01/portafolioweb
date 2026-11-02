// Motor «Taller»: piezas 3D con físicas + planos WebGL de las portadas de proyectos.
// Portado de referencia/taller-gl.js (prototipo con three r160) a three r187 + cannon-es.
//
// API (window.taller): setTheme() tras cambiar <html data-theme> · rebuild() · retexture() · destroy()
// Requisitos del DOM:
//   - secciones con data-mode="free|shelf|away|hola"
//   - wrappers de portada con data-gl="<url imagen>" que contengan un <img> (fallback)
//   - <main> con z-index 1 y fondos transparentes; el canvas va detrás (z-index 0)

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { onFrame } from "./frame-loop.js";

const FONT = '"Archivo Variable", Archivo, sans-serif';
const PAPER = "#f6f3ec";
const INK = "#1b1916";

function createTaller(canvas, opts) {
  const FOV = 30, CZ = 20, ZP = -2;
  const mouse = { x: -9999, y: -9999 };
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--ac").trim() || "#6a4fd8";
  const color = (role) => (role === "AC" ? accent() : role === "PAPER" ? PAPER : INK);
  let vw = 1, vh = 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  // r187 retiró PCFSoftShadowMap: PCFShadowMap ya filtra con shadow.radius.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CZ);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a847a, 1.7));
  const sun = new THREE.DirectionalLight(0xffffff, 2.3);
  sun.position.set(-6, 10, 14);
  sun.castShadow = true;
  const sm = window.innerWidth < 700 ? 1024 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0006;
  scene.add(sun, sun.target);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  shadowPlane.position.z = -1.04;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -30, 0) });
  world.allowSleep = false;
  world.defaultContactMaterial.friction = 0.35;
  world.defaultContactMaterial.restitution = 0.32;
  const wall = (ex, ey, ez) => {
    const b = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    b.quaternion.setFromEuler(ex, ey, ez);
    world.addBody(b);
    return b;
  };
  const floor = wall(-Math.PI / 2, 0, 0), left = wall(0, Math.PI / 2, 0), right = wall(0, -Math.PI / 2, 0), back = wall(0, 0, 0), front = wall(0, Math.PI, 0);
  back.position.z = -1;
  front.position.z = 1;

  let H = 1, W = 1, S = 1.1, small = window.innerWidth < 700;
  function resize() {
    // El canvas es fixed + inset:0, así que su caja es el viewport sin la barra de scroll.
    vw = canvas.clientWidth || window.innerWidth;
    vh = canvas.clientHeight || window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    H = Math.tan((FOV * Math.PI) / 360) * CZ;
    W = H * camera.aspect;
    floor.position.y = -H;
    left.position.x = -W;
    right.position.x = W;
    shadowPlane.scale.set(2 * W * 1.2 + 6, 2 * H * 1.2 + 6, 1);
    const sc = sun.shadow.camera;
    sc.left = -W - 8; sc.right = W + 8; sc.top = H + 8; sc.bottom = -H - 8; sc.near = 1; sc.far = 60;
    sc.updateProjectionMatrix();
    // Cruzar los 700px cambia tamaño y número de piezas.
    const nowSmall = window.innerWidth < 700;
    if (nowSmall !== small) { small = nowSmall; build(); }
    // Las piezas que quedaron fuera al estrecharse la ventana vuelven dentro.
    for (const p of pieces) {
      const b = p.body, lim = W - S * 0.6;
      if (b.position.x > lim) b.position.x = lim;
      if (b.position.x < -lim) b.position.x = -lim;
      if (b.position.y < -H + S * 0.5) b.position.y = -H + S * 0.6;
    }
  }

  function roundedBox(s, r) {
    const g = new THREE.BoxGeometry(s, s, s, 10, 10, 10);
    const p = g.attributes.position, nr = g.attributes.normal, lim = s / 2 - r;
    const v = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      c.set(Math.max(-lim, Math.min(lim, v.x)), Math.max(-lim, Math.min(lim, v.y)), Math.max(-lim, Math.min(lim, v.z)));
      n.copy(v).sub(c).normalize();
      v.copy(c).addScaledVector(n, r);
      p.setXYZ(i, v.x, v.y, v.z);
      nr.setXYZ(i, n.x, n.y, n.z);
    }
    return g;
  }
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  function tex(ch, bg, fg) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d");
    x.fillStyle = bg;
    x.fillRect(0, 0, 256, 256);
    x.globalAlpha = 0.3;
    x.strokeStyle = fg;
    x.lineWidth = 4;
    x.strokeRect(24, 24, 208, 208);
    x.globalAlpha = 1;
    x.fillStyle = fg;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = `800 ${ch.length > 1 ? 92 : 150}px ${FONT}`;
    x.fillText(ch, 128, 138);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(4, maxAniso);
    return t;
  }

  const pieces = [];
  const IDQ = new CANNON.Quaternion(0, 0, 0, 1);
  const CYLQ = new CANNON.Quaternion();
  CYLQ.setFromEuler(Math.PI / 2, 0, 0);
  function clear() {
    for (const p of pieces) {
      scene.remove(p.mesh);
      world.removeBody(p.body);
      p.mesh.geometry.dispose();
      if (p.mesh.material.map) p.mesh.material.map.dispose();
      p.mesh.material.dispose();
    }
    pieces.length = 0;
  }
  const word = () => (document.documentElement.lang === "en" ? ["H", "E", "Y", "!"] : ["H", "O", "L", "A"]);
  function glyph(sp, i) {
    return i < 4 ? word()[i] : sp[1];
  }
  // Colores por rol (AC/PAPER/INK) para poder repintar al cambiar de tema sin reconstruir.
  function build() {
    clear();
    S = small ? 0.85 : 1.1;
    let n = Math.max(4, Math.min(24, opts.pieces ?? 12));
    if (small) n = Math.min(n, 9);
    const spec = [
      ["box", "", "AC", "PAPER"], ["box", "", "PAPER", "INK"], ["box", "", "INK", "AC"], ["box", "", "PAPER", "AC"],
      ["box", "J", "INK", "PAPER"], ["box", "V", "AC", "INK"], ["sph", "AC"], ["box", "</>", "PAPER", "INK"], ["cyl", "INK"],
      ["sph", "INK"], ["box", "{ }", "INK", "PAPER"], ["cyl", "AC"], ["sph", "PAPER"],
    ];
    for (let i = 0; i < n; i++) {
      const sp = spec[i < spec.length ? i : 4 + ((i - 4) % (spec.length - 4))];
      let mesh, shape, tq = IDQ;
      if (sp[0] === "box") {
        mesh = new THREE.Mesh(roundedBox(S, S * 0.14), new THREE.MeshStandardMaterial({ map: tex(glyph(sp, i), color(sp[2]), color(sp[3])), roughness: 0.62 }));
        shape = new CANNON.Box(new CANNON.Vec3(S / 2, S / 2, S / 2));
      } else if (sp[0] === "sph") {
        const r = S * 0.5;
        mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), new THREE.MeshStandardMaterial({ color: color(sp[1]), roughness: 0.3 }));
        shape = new CANNON.Sphere(r);
      } else {
        const r = S * 0.55, h = S * 0.42;
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40), new THREE.MeshStandardMaterial({ color: color(sp[1]), roughness: 0.42 }));
        shape = new CANNON.Cylinder(r, r, h, 16);
        tq = CYLQ;
      }
      mesh.castShadow = true;
      const body = new CANNON.Body({ mass: 1, shape, linearDamping: 0.05, angularDamping: 0.1 });
      body.position.set(-W * 0.15 + Math.random() * W * 1.05, H + 1.5 + i * 0.95, (Math.random() - 0.5) * 0.4);
      body.quaternion.setFromEuler(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      world.addBody(body);
      scene.add(mesh);
      pieces.push({ mesh, body, i, tq, spec: sp });
    }
  }
  function retexture() {
    for (const p of pieces) {
      const m = p.mesh.material, sp = p.spec;
      if (sp[0] === "box") {
        if (m.map) m.map.dispose();
        m.map = tex(glyph(sp, p.i), color(sp[2]), color(sp[3]));
        m.needsUpdate = true;
      } else {
        m.color.set(color(sp[1]));
      }
    }
  }

  function target(p, mode) {
    const g = S * 1.22;
    if (mode === "shelf") {
      const col = p.i % shelfCols, row = Math.floor(p.i / shelfCols);
      return [W - S * 0.85 - col * g, -H + S * 0.75 + row * g];
    }
    if (mode === "away") return [-W + ((p.i + 0.5) / pieces.length) * 2 * W, H + 3 + (p.i % 3) * 1.2];
    if (mode === "hola" && p.i < 4) {
      const x0 = window.innerWidth < 900 ? -1.5 * g : W - S * 0.9 - 3 * g;
      return [x0 + p.i * g, -H + S * 0.5 + 0.02];
    }
    return null;
  }
  const sections = [...document.querySelectorAll("[data-mode]")];
  let active = null, shelfCols = 3;
  function detectMode() {
    const mid = vh * 0.5;
    let m = "free";
    active = null;
    for (const el of sections) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) {
        m = el.getAttribute("data-mode");
        active = el;
      }
    }
    if (m === "shelf" && (window.innerWidth < 1180 || !fitShelf())) m = "away";
    return m;
  }
  // La repisa vive a la derecha de la columna de lectura (.reading, 900px). Entre 1180
  // y ~1300px no caben 3 columnas sin pisar el texto: se usan 2, y si ni eso, "away".
  function fitShelf() {
    const col = active && (active.querySelector(".reading") || active);
    if (!col) return (shelfCols = 3);
    const upp = (2 * H) / vh; // unidades de mundo por px en z = 0
    const xMin = (col.getBoundingClientRect().right - vw / 2) * upp + S * 0.75;
    const xMax = W - S * 0.85;
    shelfCols = Math.max(0, Math.min(3, Math.floor((xMax - xMin) / (S * 1.22)) + 1));
    return shelfCols >= 2;
  }

  // ── Arrastrar y lanzar ──────────────────────────────────────────────────
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let drag = null, lastPick = 0, curCursor = "";
  function setRay(e) {
    ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  function pick(e) {
    setRay(e);
    const hit = ray.intersectObjects(pieces.map((p) => p.mesh), false)[0];
    return hit ? pieces.find((p) => p.mesh === hit.object) : null;
  }
  function planePoint(e) {
    setRay(e);
    const o = ray.ray.origin, d = ray.ray.direction, t = -o.z / d.z;
    return [o.x + d.x * t, o.y + d.y * t];
  }
  const isUI = (e) => e.target && e.target.closest && e.target.closest("a,button,input,textarea,select,label,summary,[role=button],[data-no-drag]");
  function down(e) {
    if (e.button > 0 || isUI(e)) return;
    const p = pick(e);
    if (!p) return;
    e.preventDefault();
    const [x, y] = planePoint(e);
    drag = { p, x, y };
    document.documentElement.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  }
  function move(e) {
    if (drag) {
      const [x, y] = planePoint(e);
      drag.x = x;
      drag.y = y;
      return;
    }
    if (!fine) return;
    const now = performance.now();
    if (now - lastPick < 60) return;
    lastPick = now;
    const c = !isUI(e) && pick(e) ? "grab" : "";
    if (c !== curCursor) {
      curCursor = c;
      document.documentElement.style.cursor = c;
    }
  }
  function up() {
    if (!drag) return;
    const v = drag.p.body.velocity, m = Math.hypot(v.x, v.y);
    if (m > 45) v.scale(45 / m, v);
    drag = null;
    curCursor = "";
    document.documentElement.style.cursor = "";
    document.body.style.userSelect = "";
  }
  // En táctil, pointerdown no puede frenar el scroll: si el dedo cae sobre una pieza,
  // cancelamos el touchstart para que el gesto arrastre la pieza en vez de la página.
  function touchStart(e) {
    if (drag) e.preventDefault();
  }
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("touchstart", touchStart, { passive: false });

  // ── Planos de las portadas ──────────────────────────────────────────────
  const vs = `uniform float uVel; uniform float uHover; uniform vec2 uMouse; varying vec2 vUv;
    void main(){ vUv = uv; vec3 p = position; float d = distance(uv, uMouse);
      p.z += uHover * 0.45 * exp(-d * d * 9.0); p.z += sin(uv.y * 3.14159) * uVel * 0.9;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`;
  const fs = `uniform sampler2D uTex; uniform vec2 uRes; uniform float uVel; uniform float uHover; varying vec2 vUv;
    void main(){ float pa = uRes.x, ia = uRes.y; vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
      vec2 uv = vec2((vUv.x - 0.5) * s.x + 0.5, 1.0 - (1.0 - vUv.y) * s.y);
      uv = (uv - vec2(0.5, 1.0)) * (1.0 - 0.035 * uHover) + vec2(0.5, 1.0);
      float sh = uVel * 0.006;
      vec3 c = vec3(texture2D(uTex, uv + vec2(0.0, sh)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(0.0, sh)).b);
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
    }`;
  const planes = [], loader = new THREE.TextureLoader();
  document.querySelectorAll("[data-gl]").forEach((el) => {
    const src = el.getAttribute("data-gl");
    const u = { uTex: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uVel: { value: 0 }, uHover: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) } };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 40, 40), new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs }));
    mesh.position.z = ZP;
    mesh.visible = false;
    scene.add(mesh);
    const P = { el, src, mesh, u, h: 0, ready: false, swapped: false };
    loader.load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, maxAniso);
      u.uTex.value = t;
      u.uRes.value.y = t.image.width / t.image.height;
      P.ready = true;
    });
    planes.push(P);
  });
  function updatePlanes(vel) {
    const upp = (2 * Math.tan((FOV * Math.PI) / 360) * (CZ - ZP)) / vh;
    const mx = mouse.x, my = mouse.y;
    for (const P of planes) {
      const r = P.el.getBoundingClientRect();
      if (!P.ready || r.width === 0 || r.bottom < -80 || r.top > vh + 80) {
        P.mesh.visible = false;
        continue;
      }
      if (!P.swapped) {
        // Ambas cosas: si el fondo del wrapper sigue pintado, tapa el canvas.
        const img = P.el.querySelector("img");
        if (img) img.style.opacity = "0";
        P.el.style.background = "transparent";
        P.swapped = true;
      }
      P.mesh.visible = true;
      P.mesh.scale.set(r.width * upp, r.height * upp, 1);
      P.mesh.position.set((r.left + r.width / 2 - vw / 2) * upp, -(r.top + r.height / 2 - vh / 2) * upp, ZP);
      P.u.uRes.value.x = r.width / r.height;
      const inside = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
      P.h += ((inside ? 1 : 0) - P.h) * 0.08;
      P.u.uHover.value = P.h;
      if (inside) P.u.uMouse.value.set((mx - r.left) / r.width, 1 - (my - r.top) / r.height);
      P.u.uVel.value = Math.max(-1, Math.min(1, vel / 40));
    }
  }

  // ── Frame ───────────────────────────────────────────────────────────────
  let last = performance.now(), lastY = window.scrollY, vel = 0, mode = "free";
  function frame() {
    const now = performance.now(), dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    mode = detectMode();
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    vel += (dy - vel) * 0.12;
    const grav = mode === "free" || mode === "hola" ? -30 : 0;
    world.gravity.set(0, grav, 0);
    for (const p of pieces) {
      const b = p.body;
      if (drag && drag.p === p) {
        b.velocity.set((drag.x - b.position.x) * 16, (drag.y - b.position.y) * 16, -b.position.z * 4);
        b.angularVelocity.scale(0.92, b.angularVelocity);
        continue;
      }
      const t = target(p, mode);
      if (t) {
        const k = 38, c = 11;
        b.velocity.x += ((t[0] - b.position.x) * k - b.velocity.x * c) * dt;
        b.velocity.y += ((t[1] - b.position.y) * k - b.velocity.y * c) * dt - grav * dt;
        b.velocity.z += (-b.position.z * k - b.velocity.z * c) * dt;
        b.quaternion.slerp(p.tq, 0.08, b.quaternion);
        b.angularVelocity.scale(0.85, b.angularVelocity);
      } else if (mode === "free" && dy !== 0) {
        const a = Math.min(Math.abs(dy), 50);
        b.velocity.y += a * 0.05;
        b.velocity.x += (Math.random() - 0.5) * a * 0.02;
      }
    }
    world.step(1 / 60, dt, 3);
    for (const p of pieces) {
      p.mesh.position.copy(p.body.position);
      p.mesh.quaternion.copy(p.body.quaternion);
    }
    updatePlanes(vel);
    renderer.render(scene, camera);
  }
  function shade() {
    shadowMat.opacity = document.documentElement.dataset.theme === "dark" ? 0.5 : 0.16;
  }
  function theme() {
    shade();
    retexture(); // --ac cambia entre temas
  }
  function dispose() {
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    window.removeEventListener("touchstart", touchStart);
    clear();
    for (const P of planes) {
      scene.remove(P.mesh);
      P.mesh.geometry.dispose();
      P.mesh.material.dispose();
      if (P.u.uTex.value) P.u.uTex.value.dispose();
      const img = P.el.querySelector("img");
      if (img) img.style.opacity = "";
      P.el.style.background = "";
    }
    renderer.dispose();
  }
  resize();
  build();
  shade();
  return { frame, move, mouse, resize, build, retexture, theme, dispose };
}

export function initTaller(canvas, opts = {}) {
  const t = createTaller(canvas, opts);
  const off = onFrame(() => t.frame());
  const onMove = (e) => {
    t.mouse.x = e.clientX;
    t.mouse.y = e.clientY;
    t.move(e);
  };
  const onLeave = () => {
    t.mouse.x = t.mouse.y = -9999;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  const ro = new ResizeObserver(() => t.resize());
  ro.observe(canvas);
  return {
    setTheme: t.theme,
    rebuild: t.build,
    retexture: t.retexture,
    destroy() {
      off();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      t.dispose();
    },
  };
}
