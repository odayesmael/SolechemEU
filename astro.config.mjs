import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.solechem.eu',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
