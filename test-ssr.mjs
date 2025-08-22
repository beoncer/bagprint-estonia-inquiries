import { render } from './dist/server/entry-server.js'

async function testSSR() {
  try {
    console.log('🧪 Testing SSR function...')
    
    // Test home page
    const homeResult = await render('/')
    console.log('✅ Home page rendered successfully')
    console.log('📄 HTML length:', homeResult.html.length)
    console.log('🔍 Contains title tag:', homeResult.html.includes('<title>'))
    console.log('🔍 Contains meta description:', homeResult.html.includes('<meta name="description"'))
    
    // Test products page
    const productsResult = await render('/tooted')
    console.log('✅ Products page rendered successfully')
    console.log('📄 HTML length:', productsResult.html.length)
    console.log('🔍 Contains title tag:', productsResult.html.includes('<title>'))
    
    console.log('\n🎉 SSR is working correctly!')
    
  } catch (error) {
    console.error('❌ SSR test failed:', error)
  }
}

testSSR()
