import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function prerender() {
  try {
    console.log('Starting prerender process...')
    
    // Import the static data and SSR renderer
    const { getAllProducts } = await import('../dist/server/lib/static-data.js')
    const { render } = await import('../dist/server/entry-server.js')
    
    const outDir = path.join(__dirname, '../dist/client')
    
    // Generate routes
    const products = getAllProducts()
    const routes = [
      '/tooted',
      ...products.map(p => `/tooted/${p.slug}`)
    ]
    
    console.log(`Generating ${routes.length} routes...`)
    
    let successCount = 0
    let errorCount = 0
    
    // Generate HTML for each route
    for (const url of routes) {
      try {
        const { html, status } = await render(url)
        
        if (status === 200) {
          // Create directory structure
          const routePath = url === '/tooted' ? '/tooted' : url
          const filePath = path.join(outDir, routePath, 'index.html')
          const dir = path.dirname(filePath)
          
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(filePath, html, 'utf-8')
          
          console.log(`✓ Generated: ${url}`)
          successCount++
        } else if (status === 404) {
          console.warn(`⚠ Skipped 404: ${url}`)
        } else {
          console.error(`✗ Failed: ${url} (status: ${status})`)
          errorCount++
        }
      } catch (error) {
        console.error(`✗ Error generating ${url}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\nPrerender complete:`)
    console.log(`✓ Success: ${successCount}`)
    console.log(`✗ Errors: ${errorCount}`)
    
    if (errorCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Prerender failed:', error)
    process.exit(1)
  }
}

prerender()