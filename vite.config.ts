
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
    react({
      babel: {
        plugins: mode === 'production' ? [
          ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]
        ] : []
      }
    }),
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
      output: {
        manualChunks: {
          // Absolutely minimal core
          'react-core': ['react', 'react-dom'],
          
          // Router separate
          'router': ['react-router-dom'],
          
          // Only essential UI
          'ui-essential': ['@radix-ui/react-dialog'],
          
          // Data layer minimal
          'data': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          
          // Each page gets its own tiny chunk
          'home': ['./src/pages/Index'],
          'products-page': ['./src/pages/Products'],
          'product-detail': ['./src/pages/ProductDetail'],
          'contact': ['./src/pages/Contact'],
          'about': ['./src/pages/Meist'],
          
          // Admin - even more granular
          'admin-login': ['./src/pages/admin/Login'],
          'admin-dashboard': ['./src/pages/admin/Dashboard'],
          'admin-products': ['./src/pages/admin/Products'],
          'admin-other': [
            './src/pages/admin/Content', 
            './src/pages/admin/Pages',
            './src/pages/admin/SEO'
          ]
        }
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
        passes: 4, // More aggressive
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        unused: true,
        dead_code: true,
        reduce_vars: true,
        reduce_funcs: true,
        collapse_vars: true,
        inline: true,
        join_vars: true,
        loops: true,
        negate_iife: true,
        properties: true,
        sequences: true,
        side_effects: true,
        switches: true,
        top_retain: [],
        typeofs: true
      },
      mangle: {
        safari10: true,
        toplevel: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 300, // Even smaller chunks
    assetsInlineLimit: 1024, // Inline very small assets
    modulePreload: {
      polyfill: false
    },
    cssMinify: 'esbuild'
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@tanstack/react-query-devtools', 'lucide-react']
  },
  
  css: {
    devSourcemap: false,
    transformer: 'postcss'
  }
}));
