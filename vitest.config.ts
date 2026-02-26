import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Use 'jsdom' for web-like environment
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e'], // Exclude e2e tests
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
