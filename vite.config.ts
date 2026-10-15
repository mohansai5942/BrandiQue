import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Long-lived vendor chunks: they only change when dependencies change, so returning visitors keep
// them cached (/assets/* is served immutable) across site deploys.
const vendorChunk = (id: string): string | undefined => {
  // Stylesheets stay with the entry CSS (same cascade order as before); only JS is grouped.
  if (!id.includes('node_modules') || /\.css($|\?)/.test(id)) return undefined;
  if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run)\//.test(id)) return 'vendor-react';
  if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'vendor-motion';
  if (/node_modules\/lucide-react\//.test(id)) return 'vendor-icons';
  if (/node_modules\/(@xyflow|@reactflow|d3-[a-z-]+|zustand|classcat)\//.test(id)) return 'vendor-xyflow';
  if (/node_modules\/(firebase|@firebase)\//.test(id)) return 'vendor-firebase';
  return undefined;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Same browser support as before the Vite 8 upgrade (Vite 5's default 'modules' target). Vite 8's
    // default ('baseline-widely-available') would drop Safari < 16.4 / Chrome < 111, i.e. older phones.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Minify CSS with esbuild, as Vite 5 did. Vite 8's default (Lightning CSS) rewrites some rules, e.g. it
    // dropped the unprefixed backdrop-filter from .glass-morphism in index.html, which Chrome needs.
    cssMinify: 'esbuild',
    // Used by scripts/prerender.mjs to add <link rel="modulepreload"> for each page's own chunk; it is
    // deleted from dist afterwards.
    manifest: true,
    // vendor-firebase (~700 kB) is only ever loaded on idle / on form submit, never on first paint.
    chunkSizeWarningLimit: 750,
    rolldownOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: {
      'Content-Security-Policy': "frame-src 'self' https://brandique-chatbot.vercel.app https://www.brandique.in https://brandique.in;"
    },
    proxy: {
      '/api/chat': {
        target: 'https://brandique-chatbot.vercel.app',
        changeOrigin: true
      }
    }
  }
});
