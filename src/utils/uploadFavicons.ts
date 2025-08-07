import { supabase } from '@/lib/supabase';

// Import the favicon files
import favicon16 from '@/assets/favicon-16x16.png';
import favicon32 from '@/assets/favicon-32x32.png';
import icon192 from '@/assets/icon-192x192.png';
import icon512 from '@/assets/icon-512x512.png';

export async function uploadFaviconsToSupabase() {
  const faviconFiles = [
    { url: favicon16, filename: 'favicon-16x16.png', type: 'favicon' },
    { url: favicon32, filename: 'favicon-32x32.png', type: 'favicon' },
    { url: icon192, filename: 'icon-192x192.png', type: 'favicon' },
    { url: icon512, filename: 'icon-512x512.png', type: 'favicon' }
  ];

  const uploadedUrls: Record<string, string> = {};

  for (const faviconFile of faviconFiles) {
    try {
      // Fetch the file as blob
      const response = await fetch(faviconFile.url);
      const blob = await response.blob();
      
      // Convert to File object
      const file = new File([blob], faviconFile.filename, { type: 'image/png' });
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(`favicons/${faviconFile.filename}`, file, {
          upsert: true,
          contentType: 'image/png'
        });

      if (error) {
        console.error(`Error uploading ${faviconFile.filename}:`, error);
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(`favicons/${faviconFile.filename}`);

      uploadedUrls[faviconFile.filename] = publicUrlData.publicUrl;

      // Save to site_assets table
      await supabase
        .from('site_assets')
        .upsert({
          type: faviconFile.type,
          url: publicUrlData.publicUrl,
          filename: faviconFile.filename
        }, {
          onConflict: 'url'
        });

      console.log(`Uploaded ${faviconFile.filename} successfully`);
    } catch (err) {
      console.error(`Failed to upload ${faviconFile.filename}:`, err);
    }
  }

  return uploadedUrls;
}