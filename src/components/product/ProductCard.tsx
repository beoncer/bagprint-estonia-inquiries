
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
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200" style={{ minHeight: '400px' }}>
      <div className="aspect-square w-full relative overflow-hidden bg-gray-100" style={{ height: '200px' }}>
        <OptimizedImage
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          width={300}
          height={200}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
          fallbackSrc="/placeholder.svg"
        />
      </div>
      <CardContent className="p-4 flex-grow" style={{ minHeight: '120px' }}>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ height: '56px' }}>{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3" style={{ height: '60px' }}>{description}</p>
        {startingPriceResult ? (
          <p className="text-primary font-medium">
            Alates €{startingPriceResult.pricePerItem.toFixed(2)}
          </p>
        ) : (
          <p className="text-gray-400 font-medium">
            Hind puudub
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2" style={{ height: '60px' }}>
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
