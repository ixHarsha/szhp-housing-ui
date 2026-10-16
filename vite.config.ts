import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    preview: {
      port: 4175,
    },
    resolve: {
      alias: [{ find: 'src', replacement: path.resolve('./src/') }],
    },
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.VITE_DEV_API_TARGET ?? 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'esnext',
      minify: true,
    },
  };
});
