import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        unused: true
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 2048,
    modulePreload: {
      polyfill: false
    }
  },
  ssr: {
    noExternal: ['react-helmet-async']
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@tanstack/react-query-devtools']
  },
  
  css: {
    devSourcemap: false
  }
}));
