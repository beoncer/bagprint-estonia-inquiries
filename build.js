#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function build() {
  try {
    console.log('🚀 Starting Vercel build process...')
    
    // Make build script executable and run it
    await execAsync('chmod +x build-seo.sh')
    await execAsync('./build-seo.sh')
    
    console.log('✅ Build completed successfully!')
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

build()