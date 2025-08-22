export default async function handler(req, res) {
  try {
    // Import compiled SSR bundle
    const { render } = await import('../dist/server/entry-server.js')
    
    // Get the URL from the request
    let url = '/'
    if (req.url) {
      try {
        url = new URL(req.url).pathname
      } catch (e) {
        url = req.url
      }
    } else if (req.originalUrl) {
      url = req.originalUrl
    }
    
    const { html, status } = await render(url)

    // Cache at the edge for 5 minutes; serve stale while revalidating for a day
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8').send(html)
  } catch (e) {
    console.error('SSR Error:', e)
    res.status(500).send('<!doctype html><html><body><h1>500 - Server Error</h1></body></html>')
  }
} 