import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadFaviconsToSupabase } from '@/utils/uploadFavicons';

export default function FaviconUploadPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFavicons = async () => {
    setIsUploading(true);
    try {
      const uploadedUrls = await uploadFaviconsToSupabase();
      
      if (Object.keys(uploadedUrls).length > 0) {
        toast.success(`Successfully uploaded ${Object.keys(uploadedUrls).length} favicon files to Supabase storage!`);
        console.log('Uploaded favicon URLs:', uploadedUrls);
      } else {
        toast.error('Failed to upload favicon files');
      }
    } catch (error) {
      console.error('Error uploading favicons:', error);
      toast.error('Failed to upload favicon files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Favicons to Supabase</CardTitle>
          <CardDescription>
            Upload the new shopping bag favicon files to Supabase storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleUploadFavicons} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Favicons to Supabase'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}