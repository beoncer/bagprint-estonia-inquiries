
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Plus, AlertCircle } from "lucide-react";
import { PRODUCT_COLORS, ProductColor } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface ColorImageUploadProps {
  onColorImagesChange: (colorImages: Record<string, string>) => void;
  currentColorImages?: Record<string, string>;
  availableColors: ProductColor[];
  mainColor?: string;
  onMainColorChange?: (color: string) => void;
  productTitle: string;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ColorImageUpload: React.FC<ColorImageUploadProps> = ({
  onColorImagesChange,
  currentColorImages = {},
  availableColors,
  mainColor,
  onMainColorChange,
  productTitle
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, session } = useAuth();

  const checkAuthentication = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Error",
        description: "Please log in to upload images",
        variant: "destructive"
      });
      return false;
    }

    // Check if session is still valid
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    if (error || !currentSession) {
      toast({
        title: "Session Expired", 
        description: "Please log in again",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadColorImage = async (file: File, color: string) => {
    console.log('🔄 Starting upload for color:', color, 'file:', file.name);
    console.log('📁 File details:', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check authentication before proceeding
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      return;
    }

    setUploading(color);
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const fileName = `${slugify(productTitle)}-${color}-${timestamp}.${fileExt}`;
      const filePath = `products/color-images/${fileName}`;

      console.log('Uploading to path:', filePath);

      // First, check if bucket exists and is accessible
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      if (bucketError) {
        console.error('Bucket list error:', bucketError);
        throw new Error(`Storage access error: ${bucketError.message}`);
      }

      const siteAssetsBucket = buckets?.find(bucket => bucket.name === 'site-assets');
      if (!siteAssetsBucket) {
        throw new Error('site-assets bucket not found');
      }

      // Try to upload the file
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Upload response:', { data, error });

      if (error) {
        console.error('Upload error details:', error);
        
        // Handle specific error types
        if (error.message.includes('Unauthorized')) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (error.message.includes('not found')) {
          throw new Error('Storage bucket not accessible. Please contact support.');
        } else {
          throw new Error(`Upload failed: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('Upload succeeded but no data returned');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      // Update color images
      const updatedColorImages = {
        ...currentColorImages,
        [color]: publicUrl
      };

      onColorImagesChange(updatedColorImages);
      
      toast({
        title: "Success",
        description: `${color} image uploaded successfully`
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || `Failed to upload ${color} image`,
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadColorImage(file, color);
    }
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const removeColorImage = (color: string) => {
    const updatedColorImages = { ...currentColorImages };
    delete updatedColorImages[color];
    onColorImagesChange(updatedColorImages);
    if (mainColor === color && onMainColorChange) {
      onMainColorChange("");
    }
  };

  const getColorLabel = (colorValue: string) => {
    const colorConfig = PRODUCT_COLORS.find(c => c.value === colorValue);
    return colorConfig?.label || colorValue;
  };

  const getColorStyle = (colorValue: string) => {
    // Define color styles based on color values
    const colorStyles: Record<string, React.CSSProperties> = {
      naturalne: { backgroundColor: '#F5F5DC' },
      oranz: { backgroundColor: '#FFA500' },
      pehme_kollane: { backgroundColor: '#F0E68C' },
      punane: { backgroundColor: '#FF0000' },
      roosa: { backgroundColor: '#FFC0CB' },
      royal_sinine: { backgroundColor: '#4169E1' },
      taevasinine: { backgroundColor: '#87CEEB' },
      tume_roheline: { backgroundColor: '#006400' },
      tume_sinine: { backgroundColor: '#000080' },
      valge: { backgroundColor: '#FFFFFF', color: '#000000' },
      granate: { backgroundColor: '#800020' },
      hall: { backgroundColor: '#808080' },
      hele_roheline: { backgroundColor: '#90EE90' },
      kollane: { backgroundColor: '#FFFF00', color: '#000000' },
      lilla: { backgroundColor: '#800080' },
      must: { backgroundColor: '#000000' }
    };
    return colorStyles[colorValue] || { backgroundColor: '#CCCCCC' };
  };

  // Show authentication warning if not logged in
  if (!user || !session) {
    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold">Color-Specific Images</Label>
        <div className="border rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-lg font-medium mb-2">Authentication Required</p>
          <p className="text-gray-600">Please log in to upload color images.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Color-Specific Images</Label>
      <p className="text-sm text-gray-600 mb-4">
        Upload different images for each color variant. Mark one as the main image (shown as default on product page).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableColors.map((color) => {
          const colorImage = currentColorImages[color];
          const isUploading = uploading === color;
          const altText = `${productTitle} ${color}`;
          
          return (
            <div key={color} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge 
                  style={getColorStyle(color)}
                  className="text-white font-medium"
                >
                  {getColorLabel(color)}
                </Badge>
                {colorImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeColorImage(color)}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {colorImage && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name="mainColor"
                    checked={mainColor === color}
                    onChange={() => onMainColorChange && onMainColorChange(color)}
                    disabled={!colorImage}
                  />
                  <span className="text-xs">Set as main image</span>
                  {mainColor === color && <span className="ml-1 text-blue-600 text-xs font-semibold">(Main)</span>}
                </div>
              )}
              {colorImage ? (
                <div className="relative">
                  <img 
                    src={colorImage} 
                    alt={altText}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, color)}
                      disabled={isUploading}
                      className="text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-600 mb-2">
                    No image uploaded
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, color)}
                    disabled={isUploading}
                    className="text-xs"
                  />
                </div>
              )}

              {isUploading && (
                <div className="text-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mx-auto mb-1"></div>
                  Uploading...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {availableColors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="mx-auto h-12 w-12 mb-4" />
          <p>No colors selected for this product.</p>
          <p className="text-sm">Add colors to the product to upload color-specific images.</p>
        </div>
      )}
    </div>
  );
};

export default ColorImageUpload;
