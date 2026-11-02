// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://jairovera.dev",
  integrations: [
    sitemap({
      // Sin páginas 404 y con las alternas ES/EN de cada URL (mismos hreflang que el <head>)
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
      i18n: { defaultLocale: "es", locales: { es: "es", en: "en" } },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Las fuentes nunca se incrustan como data: (la CSP solo permite font-src 'self').
    build: { assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined) },
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
