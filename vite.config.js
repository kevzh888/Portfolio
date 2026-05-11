import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // './' makes asset paths relative — works for both GitHub Pages project repos
  // (/username/repo-name/) and custom domains (/).
  base: './',
  build: {
    // Emit source maps only in CI if needed; omit from public build
    sourcemap: false,
    rollupOptions: {
      output: {
        // Keep vendor chunk separate for better caching
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
  server: {
    // Restrict dev server to localhost only (mitigates esbuild CSRF CVE)
    host: 'localhost',
  },
});
