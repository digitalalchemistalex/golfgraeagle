import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://golfgraeagle.com',
  integrations: [
    react(),
    sitemap({
      customPages: ['https://golfgraeagle.com/trips/'],
      filter: (page) => {
        // Exclude old /courses/ routes (redirected to /portfolio/)
        if (page.includes('/courses/graeagle-meadows')) return false;
        if (page.includes('/courses/whitehawk-ranch')) return false;
        if (page.includes('/courses/plumas-pines')) return false;
        if (page.includes('/courses/grizzly-ranch')) return false;
        if (page.includes('/courses/nakoma-dragon')) return false;
        if (page.includes('/courses/') && page !== 'https://golfgraeagle.com/all-golf-courses/') return false;
        // Exclude wrong portfolio slugs
        if (page.includes('/portfolio/graeagle-meadows-golf-course/')) return false;
        if (page.includes('/portfolio/grizzly-ranch-golf-club/')) return false;
        if (page.includes('/portfolio/whitehawk-ranch-golf-course/')) return false;
        if (page.includes('/portfolio/plumas-pines-golf-resort/')) return false;
        // Exclude /quote/ (alias, not canonical)
        if (page.endsWith('/quote/')) return false;
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel(),
});
