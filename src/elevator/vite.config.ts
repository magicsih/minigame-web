import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const repoRoot = path.resolve(__dirname, '../../');
    return {
      root: __dirname,
      base: '/elevator/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: path.resolve(__dirname, '../../public/elevator'),
        emptyOutDir: true,
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html')
        }
      }
    };
});
