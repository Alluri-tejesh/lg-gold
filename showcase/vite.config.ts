import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the site works when served from a sub-path such as /lg-gold/showcase/.
export default defineConfig({
  base: './',
  plugins: [react()],
});
