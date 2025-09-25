import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend in development
      '/api': {
        target: 'http://localhost:5000', // your local backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build', // match Vercel static build folder
  },
});
