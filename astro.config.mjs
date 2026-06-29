// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://jairovera.dev",
  integrations: [tailwind(), sitemap(), icon()],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"], // Ahora incluye "es"
  },
});