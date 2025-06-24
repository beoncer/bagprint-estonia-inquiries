import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Plus } from "lucide-react";
import { PRODUCT_COLORS, ProductColor } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface ColorImageUploadProps {
  onColorImagesChange: (colorImages: Record<string, string>) => void;
  currentColorImages?: Record<string, string>;
  availableColors: ProductColor[];
  mainColor?: string;
  onMainColorChange?: (color: string) => void;
}

const ColorImageUpload: React.FC<ColorImageUploadProps> = ({
  onColorImagesChange,
  currentColorImages = {},
  availableColors,
  mainColor,
  onMainColorChange
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadColorImage = async (file: File, color: string) => {
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

    setUploading(color);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${color}-${Date.now()}.${fileExt}`;
      const filePath = `products/color-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

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
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: `Failed to upload ${color} image`,
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
                    alt={`${getColorLabel(color)} product`} 
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