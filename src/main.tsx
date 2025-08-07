
import './utils/autoUploadFavicons'; // Auto-upload favicons to Supabase
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Simplified performance monitoring
const startTime = performance.now();

// Enhanced service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
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

// Optimized loading content
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML.trim() || rootElement.innerHTML.includes('noscript')) {
  rootElement.innerHTML = `
    <div style="
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
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 1rem;
          line-height: 1.2;
        ">Leatex<span style="color: black;">.</span></h1>
        
        <div style="
          height: 4px;
          margin: 1rem auto;
          border-radius: 2px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          width: 100%;
        "></div>
        
        <p style="
          color: #6b7280;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        ">Kvaliteetsed kotid ja pakendid</p>
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

// Simplified performance measurement
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

// Optimized React root creation
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
