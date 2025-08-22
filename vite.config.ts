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
  ssr: {
    noExternal: ['react-helmet-async']
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          // Core React - keep minimal
          'react-core': ['react', 'react-dom'],
          
          // Router - separate small chunk
          'router': ['react-router-dom'],
          
          // Essential UI only
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // Data layer
          'data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Split pages into very small chunks
          'page-home': ['./src/pages/Index'],
          'page-products': ['./src/pages/Products'],
          'page-product-detail': ['./src/pages/ProductDetail'],
          'page-contact': ['./src/pages/Contact'],
          'page-meist': ['./src/pages/Meist'],
          
          // Admin chunks - only load when needed
          'admin-auth': ['./src/pages/admin/Login'],
          'admin-main': ['./src/pages/admin/Dashboard', './src/pages/admin/Products'],
          'admin-content': ['./src/pages/admin/Content', './src/pages/admin/Pages'],
          'admin-settings': ['./src/pages/admin/SEO', './src/pages/admin/Assets']
        }
      },
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
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@tanstack/react-query-devtools']
  },
  
  css: {
    devSourcemap: false
  }
}));
