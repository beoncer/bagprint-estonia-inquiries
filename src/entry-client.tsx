import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import DynamicSEO from '@/components/seo/DynamicSEO';
import WebSiteStructuredData from '@/components/seo/WebSiteStructuredData';
import ScrollToTop from './components/ui/ScrollToTop';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AppRoutes from './AppRoutes';
import './index.css';

// Performance monitoring
const startTime = performance.now();

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('SW registered');
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available');
              }
            });
          }
        });
      })
      .catch(() => {
        console.log('SW registration failed');
      });
  });
}

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    },
  },
});

const App: React.FC = () => {
  // Get route data injected by SSR
  const routeData = (window as any).__ROUTE_DATA__ || {};

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <ScrollToTop />
              <AuthProvider>
                <DynamicSEO />
                <WebSiteStructuredData />
                <AppRoutes routeData={routeData} />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

// Performance measurement
const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    setTimeout(() => {
      const loadTime = performance.now() - startTime;
      if (import.meta.env.DEV) {
        console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
      }
    }, 1000);
  }
};

measurePerformance();

const container = document.getElementById('root')!;

// Check if we have SSR content to hydrate
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  // Fallback for client-only navigation
  createRoot(container).render(<App />);
}

export default App;