import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '/';
  
  try {
    // Import compiled SSR bundle
    const { render } = await import('../dist/server/entry-server.js');
    const { html, status } = await render(url);

    // Set caching headers - cache at edge for 5 minutes, serve stale for 1 day
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    res.status(status).send(html);
  } catch (error: any) {
    console.error('SSR Error:', error);
    
    // Send minimal HTML on error
    const errorHtml = `<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Leatex - Viga laadimise</title>
</head>
<body>
  <div id="root">
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Leatex</h1>
        <p>Leht laadib...</p>
      </div>
    </div>
  </div>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</body>
</html>`;
    
    res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
  }
}