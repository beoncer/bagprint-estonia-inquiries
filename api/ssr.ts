import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Debug: Log all request details
    console.log('🚨 SSR DEBUG - Full request details:')
    console.log('📍 req.url:', req.url)
    console.log('📍 req.path:', (req as any).path)
    console.log('📍 req.originalUrl:', (req as any).originalUrl)
    console.log('📍 req.headers.host:', req.headers.host)
    console.log('📍 req.headers.referer:', req.headers.referer)
    
    // Import compiled SSR bundle
    const { render } = await import('../dist/server/entry-server.js')
    
    // Try different ways to get the URL
    let url = '/'
    if (req.url) {
      try {
        url = new URL(req.url).pathname
        console.log('✅ Using req.url pathname:', url)
      } catch (e) {
        console.log('❌ Error parsing req.url, using as-is:', req.url)
        url = req.url
      }
    } else if ((req as any).originalUrl) {
      url = (req as any).originalUrl
      console.log('✅ Using req.originalUrl:', url)
    } else {
      console.log('❌ No URL found, defaulting to /')
    }
    
    console.log('🎯 Final URL passed to render():', url)
    
    const { html, status } = await render(url)

    // Cache at the edge for 5 minutes; serve stale while revalidating for a day
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8').send(html)
  } catch (e: any) {
    console.error('SSR Error:', e)
    res.status(500).send('<!doctype html><html><body><h1>500 - Server Error</h1></body></html>')
  }
}
