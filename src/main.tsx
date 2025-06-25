
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance monitoring
const startTime = performance.now();

// Register service worker for PWA with better caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Update service worker when new version available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                console.log('New content available, please refresh.');
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.href = '/critical.css';
  criticalCSS.as = 'style';
  criticalCSS.onload = () => {
    criticalCSS.rel = 'stylesheet';
  };
  document.head.appendChild(criticalCSS);

  // Preload Fixel Display font
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = '/fonts/FixelDisplay-Regular.woff2';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);
};

// Add loading content while React app loads with better styling
const rootElement = document.getElementById("root")!;

// Only add loading content if the root is empty (not from SSR)
if (!rootElement.innerHTML.trim() || rootElement.innerHTML.includes('noscript')) {
  rootElement.innerHTML = `
    <div class="fallback-content" style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
    ">
      <div style="text-align: center; max-width: 600px;">
        <h1 style="
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.2;
        ">Leatex - Kvaliteetsed kotid ja pakendid</h1>
        
        <div class="loading-skeleton" style="
          height: 8px;
          margin: 1rem auto;
          border-radius: 4px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          width: 100%;
        "></div>
        
        <div class="loading-skeleton" style="
          height: 8px;
          margin: 1rem auto;
          border-radius: 4px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          width: 70%;
          animation-delay: 0.2s;
        "></div>
        
        <p style="
          color: #6b7280;
          margin-top: 1.5rem;
          font-size: 1rem;
        ">Laadime veebilehte...</p>
      </div>
      
      <style>
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      </style>
    </div>
  `;
}

// Initialize performance monitoring
const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    setTimeout(() => {
      const loadTime = performance.now() - startTime;
      console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
      
      // Report Core Web Vitals if available
      if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        });
      }
    }, 1000);
  }
};

// Preload resources and measure performance
preloadCriticalResources();
measurePerformance();

// Use createRoot for better performance
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
