import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
// https://astro.build/config
export default defineConfig({
  site: 'https://path2you.studio/',
  integrations: [react(), tailwind(), sitemap()],
});