import { supabase } from '@/lib/supabase';

// Function to upload a file from a URL to Supabase storage
async function uploadFileFromUrl(fileUrl: string, fileName: string, bucketName: string = 'site-assets') {
  try {
    // Fetch the file as blob
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileUrl}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: 'image/png' });
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`favicons/${fileName}`, file, {
        upsert: true,
        contentType: 'image/png'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`favicons/${fileName}`);

    // Save to site_assets table
    await supabase
      .from('site_assets')
      .upsert({
        type: 'favicon',
        url: publicUrlData.publicUrl,
        filename: fileName
      }, {
        onConflict: 'url'
      });

    console.log(`✅ Uploaded ${fileName} to Supabase storage`);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error);
    throw error;
  }
}

// Upload all favicon files to Supabase
export async function uploadAllFavicons() {
  const faviconFiles = [
    { localPath: '/favicon-16x16.png', fileName: 'favicon-16x16.png' },
    { localPath: '/favicon-32x32.png', fileName: 'favicon-32x32.png' },
    { localPath: '/icon-192x192.png', fileName: 'icon-192x192.png' },
    { localPath: '/icon-512x512.png', fileName: 'icon-512x512.png' }
  ];

  const uploadedUrls: Record<string, string> = {};

  for (const favicon of faviconFiles) {
    try {
      const url = await uploadFileFromUrl(favicon.localPath, favicon.fileName);
      uploadedUrls[favicon.fileName] = url;
    } catch (error) {
      console.error(`Failed to upload ${favicon.fileName}:`, error);
    }
  }

  return uploadedUrls;
}

// Auto-execute on import
uploadAllFavicons().then((urls) => {
  console.log('🚀 All favicons uploaded to Supabase:', urls);
}).catch((error) => {
  console.error('💥 Failed to upload favicons:', error);
});