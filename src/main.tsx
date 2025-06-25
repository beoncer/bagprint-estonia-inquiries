
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Add loading content while React app loads
const rootElement = document.getElementById("root")!;

// Only add loading content if the root is empty (not from SSR)
if (!rootElement.innerHTML.trim() || rootElement.innerHTML.includes('noscript')) {
  rootElement.innerHTML = `
    <div class="fallback-content">
      <h1>Leatex - Kvaliteetsed kotid ja pakendid</h1>
      <div class="loading-skeleton" style="height: 20px; margin: 1rem 0; border-radius: 4px;"></div>
      <div class="loading-skeleton" style="height: 20px; margin: 1rem 0; border-radius: 4px; width: 70%;"></div>
      <p>Laadime veebilehte...</p>
    </div>
  `;
}

// Hydrate instead of render for better SSR support
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
