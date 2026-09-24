import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/chat': {
        target: 'https://brandique-chatbot.vercel.app',
        changeOrigin: true
      }
    }
  }
});