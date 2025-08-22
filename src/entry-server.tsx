import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import AppSSR from './App-ssr'

export async function render(url: string) {
  console.log('🎯 entry-server.render() called with URL:', url)
  
  const helmetContext: any = {}
  
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppSSR ssrPath={url} />
      </StaticRouter>
    </HelmetProvider>
  )

  const appHtml = renderToString(app)
  const { helmet } = helmetContext

  const html = `<!doctype html>
<html ${helmet.htmlAttributes?.toString() || 'lang="et"'}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    ${helmet.title?.toString() || ''}
    ${helmet.meta?.toString() || ''}
    ${helmet.link?.toString() || ''}
    ${helmet.script?.toString() || ''}
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>`
  
  return { status: 200, html }
}
