import { supabase } from '@/lib/supabase';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface SitemapStatus {
  total: number;
  staticPages: number;
  products: number;
  blogPosts: number;
  lastGenerated: string;
}

/**
 * Generate sitemap XML from database entries
 */
export async function generateSitemapXML(): Promise<string> {
  try {
    // First sync dynamic content
    await supabase.rpc('sync_dynamic_sitemap_entries');
    
    // Generate XML from database
    const { data: xml, error } = await supabase.rpc('generate_sitemap_xml');
    
    if (error) {
      console.error('Error generating sitemap XML:', error);
      throw error;
    }
    
    return xml || '';
  } catch (error) {
    console.error('Error in generateSitemapXML:', error);
    throw error;
  }
}

/**
 * Get sitemap status and counts
 */
export async function getSitemapStatus(): Promise<SitemapStatus> {
  try {
    const { data: entries, error } = await supabase
      .from('sitemap_entries')
      .select('*');
    
    if (error) {
      console.error('Error fetching sitemap entries:', error);
      throw error;
    }
    
    const total = entries?.length || 0;
    const staticPages = entries?.filter(e => !e.is_dynamic).length || 0;
    const products = entries?.filter(e => e.is_dynamic && e.source_table === 'products').length || 0;
    const blogPosts = entries?.filter(e => e.is_dynamic && e.source_table === 'blog_posts').length || 0;
    
    return {
      total,
      staticPages,
      products,
      blogPosts,
      lastGenerated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getSitemapStatus:', error);
    throw error;
  }
}

/**
 * Update the static sitemap.xml file
 */
export async function updateStaticSitemap(): Promise<void> {
  try {
    const xml = await generateSitemapXML();
    
    // Store in database for backup
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_xml',
        value: xml,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
    // Update timestamp
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_last_generated',
        value: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
    console.log('Sitemap updated successfully');
  } catch (error) {
    console.error('Error updating static sitemap:', error);
    throw error;
  }
}

/**
 * Force rebuild sitemap entries
 */
export async function rebuildSitemap(): Promise<void> {
  try {
    // Clear and rebuild dynamic entries
    await supabase.rpc('sync_dynamic_sitemap_entries');
    
    // Generate new XML
    await updateStaticSitemap();
    
    console.log('Sitemap rebuilt successfully');
  } catch (error) {
    console.error('Error rebuilding sitemap:', error);
    throw error;
  }
} 

/**
 * Update the static sitemap.xml file directly
 */
export async function updateStaticSitemapFile(): Promise<void> {
  try {
    const xml = await generateSitemapXML();
    
    // Store in database for backup
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_xml',
        value: xml,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
    // Update timestamp
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_last_generated',
        value: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    // Try to update the static file via API call
    try {
      const response = await fetch('/api/update-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xml })
      });
      
      if (response.ok) {
        console.log('Static sitemap file updated successfully');
      } else {
        console.log('Static file update failed, but database was updated');
      }
    } catch (error) {
      console.log('Static file update not available, but database was updated');
    }
    
    console.log('Sitemap updated successfully');
  } catch (error) {
    console.error('Error updating static sitemap:', error);
    throw error;
  }
} 