// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://jairovera.dev",
  integrations: [sitemap(), icon()],
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
