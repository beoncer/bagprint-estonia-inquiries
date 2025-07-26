
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePricing } from "@/hooks/usePricing";
import OptimizedImage from "@/components/ui/OptimizedImage";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  base_price: number;
  slug: string;
  color_images?: Record<string, string>;
  main_color?: string;
  image_url?: string;
}

const ProductCard = ({ id, name, description, image, base_price, slug, color_images, main_color, image_url }: ProductProps) => {
  // Use main color image if available
  const mainImage = main_color && color_images && color_images[main_color]
    ? color_images[main_color]
    : image || image_url || '/placeholder.svg';
  
  const { calculatePrice } = usePricing();
  
  // Make sure ID is valid to prevent broken links
  const safeId = id || 'unknown';
  
  // Calculate starting price using the new pricing system
  const startingPriceResult = calculatePrice({
    basePrice: base_price,
    quantity: 50,
    withPrint: false
  });
  
  // Process image URL if it's from Supabase
  const [imageUrl, setImageUrl] = useState(mainImage);
  
  useEffect(() => {
    if (mainImage) {
      if (mainImage.includes('supabase.co') || mainImage.startsWith('products/')) {
        if (mainImage.startsWith('products/')) {
          setImageUrl(`https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/products/${mainImage.replace('products/', '')}`);
        } else if (!mainImage.startsWith('https://')) {
          setImageUrl(`https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/${mainImage.split('/').slice(1).join('/')}`);
        } else {
          setImageUrl(mainImage);
        }
      } else {
        setImageUrl(mainImage);
      }
    }
  }, [mainImage]);
  
  // Get available colors from color_images
  const availableColors = color_images ? Object.keys(color_images) : [];
  
  // Color mapping for display - same as used in ColorPicker component
  const getColorStyle = (colorName: string) => {
    const colorValue = colorName.toLowerCase();
    
    return colorValue === 'naturalne' ? '#F5F5DC' :
      colorValue === 'punane' ? '#FF0000' :
      colorValue === 'must' ? '#000000' :
      colorValue === 'valge' ? '#FFFFFF' :
      colorValue === 'hall' ? '#808080' :
      colorValue === 'roosa' ? '#FFC0CB' :
      colorValue === 'lilla' ? '#800080' :
      colorValue === 'royal_sinine' ? '#4169E1' :
      colorValue === 'taevasinine' ? '#87CEEB' :
      colorValue === 'tume_sinine' ? '#000080' :
      colorValue === 'hele_roheline' ? '#90EE90' :
      colorValue === 'tume_roheline' ? '#006400' :
      colorValue === 'kollane' ? '#FFFF00' :
      colorValue === 'pehme_kollane' ? '#F0E68C' :
      colorValue === 'oranz' ? '#FFA500' :
      colorValue === 'granate' ? '#800000' : '#6b7280';
  };
  
  const altText = main_color ? `${name} ${main_color}` : name;
  
  // Truncate description to max 8 words
  const truncatedDescription = description 
    ? description.split(' ').slice(0, 8).join(' ') + (description.split(' ').length > 8 ? '...' : '')
    : '';
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link to={`/tooted/${slug}`} className="aspect-square w-full relative overflow-hidden bg-gray-100 block">
        <OptimizedImage
          src={imageUrl}
          alt={altText}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
          fallbackSrc="/placeholder.svg"
        />
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{truncatedDescription}</p>
        <div className="mt-auto">
          {availableColors.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {availableColors.slice(0, 5).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: getColorStyle(color) }}
                  title={color}
                />
              ))}
              {availableColors.length > 5 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                  +{availableColors.length - 5}
                </div>
              )}
            </div>
          )}
          {startingPriceResult ? (
            <p className="text-primary font-medium">
              Alates €{startingPriceResult.pricePerItem.toFixed(2)}
            </p>
          ) : (
            <p className="text-gray-400 font-medium">
              Hind puudub
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-sm" asChild>
          <Link to={`/tooted/${slug}`}>Vaata lähemalt</Link>
        </Button>
        <Button size="sm" className="flex-1 text-sm" asChild>
          <Link to={`/inquiry?product=${safeId}`}>Küsi pakkumist</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
