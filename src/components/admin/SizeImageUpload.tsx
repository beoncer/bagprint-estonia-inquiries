import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SizeImageUploadProps {
  onSizeImagesChange: (sizeImages: Record<string, string>) => void;
  currentSizeImages?: Record<string, string>;
  availableSizes: string[];
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

const SizeImageUpload: React.FC<SizeImageUploadProps> = ({
  onSizeImagesChange,
  currentSizeImages = {},
  availableSizes,
  productTitle
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadSizeImage = async (file: File, size: string) => {
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

    setUploading(size);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slugify(productTitle)}-${size}.${fileExt}`;
      const filePath = `products/size-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      // Update size images
      const updatedSizeImages = {
        ...currentSizeImages,
        [size]: publicUrl
      };

      onSizeImagesChange(updatedSizeImages);
      
      toast({
        title: "Success",
        description: `${size} image uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: `Failed to upload ${size} image`,
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, size: string) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSizeImage(file, size);
    }
  };

  const removeSizeImage = (size: string) => {
    const updatedSizeImages = { ...currentSizeImages };
    delete updatedSizeImages[size];
    onSizeImagesChange(updatedSizeImages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Size-Specific Images</Label>
      <p className="text-sm text-gray-600 mb-4">
        Upload different images for each size variant. This will show the appropriate image when customers select a size (if no color-specific image is available).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSizes.map((size) => {
          const sizeImage = currentSizeImages[size];
          const isUploading = uploading === size;
          const altText = `${productTitle} ${size}`;
          
          return (
            <div key={size} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-medium">
                  {size}
                </Badge>
                {sizeImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSizeImage(size)}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {sizeImage ? (
                <div className="relative">
                  <img 
                    src={sizeImage} 
                    alt={altText}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, size)}
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
                    onChange={(e) => handleFileSelect(e, size)}
                    disabled={isUploading}
                    className="text-xs"
                  />
                </div>
              )}

              {isUploading && (
                <div className="text-center text-sm text-gray-500">
                  Uploading...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {availableSizes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="mx-auto h-12 w-12 mb-4" />
          <p>No sizes selected for this product.</p>
          <p className="text-sm">Add sizes to the product to upload size-specific images.</p>
        </div>
      )}
    </div>
  );
};

export default SizeImageUpload; 