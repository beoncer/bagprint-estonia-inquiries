import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import CategoryPage from './routes/CategoryPage'
import ProductPage from './routes/ProductPage'
import { getProductBySlug, getSEOData } from './lib/static-data'
import { productLd, breadcrumbLd, categoryLd } from './seo/productLd'

type RenderResult = { html: string; status: number }

export async function render(url: string, method: string = 'GET'): Promise<RenderResult> {
  const helmetContext: any = {}
  let body: React.ReactElement
  let title = 'Bagprint | Kangakotid ja paberikotid trükiga'
  let description = 'Kvaliteetsed kangakotid, paberikotid ja pakendikarbid kohandatud trükiga. Kiire tarne ja soodne hind.'
  let canonical: string
  let extraHead = ''

  if (url === '/tooted' || url === '/tooted/') {
    // Category page
    const seoData = getSEOData('tooted')
    title = seoData?.title || 'Tooted | Bagprint'
    description = seoData?.description || 'Vaata meie laia tootesortimenti - kangakotid, paberikotid ja pakendikarbid trükiga.'
    canonical = 'https://bagprint.ee/tooted'
    
    extraHead = `
      <meta property="og:type" content="website">
      <meta property="og:title" content="${escapeHtml(title)}">
      <meta property="og:description" content="${escapeHtml(description)}">
      <meta property="og:url" content="${canonical}">
      <meta property="og:image" content="https://bagprint.ee/icon-512x512.png">
      <meta name="twitter:card" content="summary">
      <meta name="twitter:title" content="${escapeHtml(title)}">
      <meta name="twitter:description" content="${escapeHtml(description)}">
      <script type="application/ld+json">${JSON.stringify(categoryLd())}</script>
    `
    
    body = (
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <>
            <Helmet>
              <html lang="et" />
              <title>{title}</title>
              <meta name="description" content={description} />
              <link rel="canonical" href={canonical} />
              <meta name="robots" content="index,follow" />
            </Helmet>
            <CategoryPage />
          </>
        </StaticRouter>
      </HelmetProvider>
    )
  } else if (url.startsWith('/tooted/')) {
    // Product page
    const slug = url.replace('/tooted/', '').replace(/\/$/, '')
    const product = getProductBySlug(slug)
    
    if (!product) {
      return { status: 404, html: notFoundHtml('Toodet ei leitud') }
    }
    
    title = product.seo_title || `${product.name} | Bagprint`
    description = product.seo_description || product.description || `${product.name} - kvaliteetsed kotid trükiga soodsa hinnaga.`
    canonical = `https://bagprint.ee/tooted/${product.slug}`
    
    const productImage = product.color_images && product.main_color 
      ? product.color_images[product.main_color] 
      : product.image_url || 'https://bagprint.ee/icon-512x512.png'
    
    extraHead = `
      <meta property="og:type" content="product">
      <meta property="og:title" content="${escapeHtml(title)}">
      <meta property="og:description" content="${escapeHtml(description)}">
      <meta property="og:url" content="${canonical}">
      <meta property="og:image" content="${productImage}">
      <meta property="product:price:amount" content="${product.base_price}">
      <meta property="product:price:currency" content="EUR">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${escapeHtml(title)}">
      <meta name="twitter:description" content="${escapeHtml(description)}">
      <meta name="twitter:image" content="${productImage}">
      <script type="application/ld+json">${JSON.stringify(productLd(product))}</script>
      <script type="application/ld+json">${JSON.stringify(breadcrumbLd(product))}</script>
    `
    
    body = (
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <>
            <Helmet>
              <html lang="et" />
              <title>{title}</title>
              <meta name="description" content={description} />
              <link rel="canonical" href={canonical} />
              <meta name="robots" content="index,follow" />
              {product.seo_keywords && (
                <meta name="keywords" content={product.seo_keywords} />
              )}
            </Helmet>
            <ProductPage product={product} />
          </>
        </StaticRouter>
      </HelmetProvider>
    )
  } else {
    return { status: 404, html: notFoundHtml('Lehte ei leitud') }
  }

  // For HEAD requests, skip React rendering but include all metadata
  if (method === 'HEAD') {
    const headOnlyHtml = `<!doctype html>
<html lang="et">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png">
    <link rel="manifest" href="/manifest.json">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index,follow" />
    ${extraHead}
  </head>
  <body></body>
</html>`
    return { status: 200, html: headOnlyHtml }
  }

  const appHtml = renderToString(body)
  const { helmet } = helmetContext

  const html = `<!doctype html>
<html ${helmet.htmlAttributes?.toString() || 'lang="et"'}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png">
    <link rel="manifest" href="/manifest.json">
    ${helmet.title?.toString() || ''}
    ${helmet.meta?.toString() || ''}
    ${helmet.link?.toString() || ''}
    ${extraHead}
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>
</html>`

  return { status: 200, html }
}

function notFoundHtml(text: string) {
  return `<!doctype html>
<html lang="et">
  <head>
    <meta charset="utf-8">
    <title>404 - ${text} | Bagprint</title>
    <meta name="robots" content="noindex">
  </head>
  <body>
    <div style="text-align: center; padding: 50px; font-family: system-ui, sans-serif;">
      <h1>404</h1>
      <p>${text}</p>
      <a href="/" style="color: #dc2626; text-decoration: none;">← Tagasi avalehele</a>
    </div>
  </body>
</html>`
}

function escapeHtml(str: string) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}