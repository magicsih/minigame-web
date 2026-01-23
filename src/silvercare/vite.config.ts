import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      root: __dirname,
      base: '/silvercare/',
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
        outDir: path.resolve(__dirname, '../../public/silvercare'),
        emptyOutDir: true,
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html')
        }
      }
    };
});
