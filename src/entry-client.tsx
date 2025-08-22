import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

const container = document.getElementById('root')!

if (container.hasChildNodes()) {
  // Hydrate if server-rendered HTML exists
  hydrateRoot(container, (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  ))
} else {
  // Create new root if no server-rendered HTML
  createRoot(container).render(
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  )
}
