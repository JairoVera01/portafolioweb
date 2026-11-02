/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface TallerEngine {
  setTheme(): void;
  rebuild(): void;
  retexture(): void;
  destroy(): void;
}

interface Window {
  taller?: TallerEngine;
  lenis?: import("lenis").default;
}
