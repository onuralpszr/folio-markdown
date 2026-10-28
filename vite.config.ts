import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1500,
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        diagram: fileURLToPath(new URL('./diagram.html', import.meta.url)),
      },
    },
  },
  test: { include: ['tests/**/*.test.ts'] },
} as any);
