
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
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI Libraries (separate from vendor)
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-accordion', '@radix-ui/react-select'],
          
          // Data management
          'data-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Admin functionality split into smaller chunks
          'admin-core': [
            './src/pages/admin/Dashboard',
            './src/pages/admin/Products',
            './src/pages/admin/pricing'
          ],
          'admin-content': [
            './src/pages/admin/Blog',
            './src/pages/admin/Pages',
            './src/pages/admin/Content',
            './src/pages/admin/ProductPages'
          ],
          'admin-settings': [
            './src/pages/admin/SEO',
            './src/pages/admin/Assets',
            './src/pages/admin/Meist'
          ],
          'admin-misc': [
            './src/pages/admin/Portfolio',
            './src/pages/admin/Contact',
            './src/pages/admin/Footer',
            './src/pages/admin/Guarantees',
            './src/pages/admin/ProductFAQ',
            './src/pages/admin/Manual'
          ],
          
          // Public pages
          'pages-main': ['./src/pages/Index', './src/pages/Products'],
          'pages-secondary': ['./src/pages/ProductDetail', './src/pages/Contact', './src/pages/Meist'],
          'pages-misc': ['./src/pages/Portfolio', './src/pages/Blog', './src/pages/BlogPost']
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
    },
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: {
          safari10: true
        }
      },
    }),
    cssCodeSplit: true,
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000,
    
    // Optimize asset processing
    assetsInlineLimit: 4096,
  },
  
  // Enhanced SSR optimizations
  ssr: {
    noExternal: ['@supabase/supabase-js'],
  },
  
  // Aggressive optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query'
    ],
    exclude: [
      '@tanstack/react-query-devtools',
      '@supabase/supabase-js'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  
  // Enhanced caching
  cacheDir: '.vite',
  
  // CSS optimization
  css: {
    devSourcemap: mode === 'development'
  }
}));
