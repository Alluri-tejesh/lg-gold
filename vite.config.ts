import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';

/**
 * Link previews (WhatsApp, Facebook, LinkedIn) need full addresses for the share image and page.
 * The deploy workflow passes the live site address as SITE_URL; local builds keep relative paths.
 */
const siteUrl = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml(html) {
    const site = (process.env.SITE_URL || '').replace(/\/$/, '');
    if (!site) return html;
    return html
      .replace('content="og-image.jpg"', `content="${site}/og-image.jpg"`)
      .replace('</head>', `  <meta property="og:url" content="${site}/" />\n    <link rel="canonical" href="${site}/" />\n  </head>`);
  },
});

export default defineConfig({
  // Relative base so the build works on GitHub Pages project sites (hash routing, no server needed).
  base: './',
  plugins: [react(), tailwindcss(), siteUrl()],
  server: { proxy: { '/api': { target: 'http://127.0.0.1:4000', changeOrigin: false } } },
  build: {
    // React itself changes rarely, so it gets its own file that browsers keep cached between site updates.
    rollupOptions: {
      output: {
        manualChunks: {react: ['react', 'react-dom']},
      },
    },
  },
});
