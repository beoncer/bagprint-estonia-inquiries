import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Skip if environment variables are not available (like in some build environments)
if (!supabaseUrl || !supabaseServiceKey) {
  console.log('⚠️ Missing Supabase environment variables for sitemap update');
  console.log('💡 Sitemap will be updated when environment variables are available');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSitemap() {
  try {
    console.log('🔄 Updating static sitemap.xml...');
    
    // Generate sitemap XML from database
    const { data: xml, error: generateError } = await supabase.rpc('generate_sitemap_xml');
    
    if (generateError) {
      console.error('❌ Error generating sitemap XML:', generateError);
      console.log('⚠️ Sitemap update failed, but build will continue');
      process.exit(0);
    }

    if (!xml) {
      console.log('⚠️ No sitemap XML generated, but build will continue');
      process.exit(0);
    }

    // Write to static file
    const projectRoot = join(__dirname, '..');
    const sitemapPath = join(projectRoot, 'public', 'sitemap.xml');
    
    await fs.writeFile(sitemapPath, xml, 'utf8');
    console.log('✅ Static sitemap.xml updated successfully');
    
    // Update timestamp in database
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_last_generated',
        value: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
  } catch (error) {
    console.error('❌ Error updating sitemap:', error);
    console.log('⚠️ Sitemap update failed, but build will continue');
    process.exit(0);
  }
}

updateSitemap(); 