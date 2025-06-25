
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePricing } from "@/hooks/usePricing";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  base_price: number; // Changed from basePrice to base_price
  slug: string;
  color_images?: Record<string, string>;
  main_color?: string;
  image_url?: string;
}

const ProductCard = ({ id, name, description, image, base_price, slug, color_images, main_color, image_url }: ProductProps) => {
  const [imageError, setImageError] = useState(false);
  // Use main color image if available
  const mainImage = main_color && color_images && color_images[main_color]
    ? color_images[main_color]
    : image || image_url || '/placeholder.svg';
  const [imageUrl, setImageUrl] = useState(mainImage);
  const { calculatePrice } = usePricing();
  
  // Make sure ID is valid to prevent broken links
  const safeId = id || 'unknown';
  
  // Calculate starting price using the new pricing system
  const startingPriceResult = calculatePrice({
    basePrice: base_price, // Use base_price instead of basePrice
    quantity: 50, // Use 50 as the base quantity for starting price
    withPrint: false
  });
  
  // Process image URL if it's from Supabase
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
    
    console.log("Setting image URL:", imageUrl, "from original:", mainImage);
  }, [mainImage]);
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square w-full relative overflow-hidden">
        <img 
          src={imageError ? '/placeholder.svg' : imageUrl} 
          alt={name} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          onError={() => {
            console.log(`Image error for product ${safeId} (${name}), using placeholder. Image URL was: ${imageUrl}`);
            setImageError(true);
          }}
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        {startingPriceResult ? (
          <p className="text-primary font-medium mt-2">
            Alates €{startingPriceResult.pricePerItem.toFixed(2)}
          </p>
        ) : (
          <p className="text-gray-400 font-medium mt-2">
            Hind puudub
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/tooted/${slug}`}>Vaata lähemalt</Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/inquiry?product=${safeId}`}>Küsi pakkumist</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
