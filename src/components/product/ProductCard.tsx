
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  startingPrice: number;
}

const ProductCard = ({ id, name, description, image, startingPrice }: ProductProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square w-full relative overflow-hidden">
        <img 
          src={imageError ? '/placeholder.svg' : image} 
          alt={name} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          onError={() => {
            console.log(`Image error for product ${id} (${name}), using placeholder. Image URL was: ${image}`);
            setImageError(true);
          }}
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2">{name || 'Unnamed Product'}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description || 'No description available'}</p>
        <p className="text-primary font-medium mt-2">
          Alates {(startingPrice || 0).toFixed(2)} €
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/products/${id}`}>Vaata lähemalt</Link>
        </Button>
        <Button asChild>
          <Link to={`/inquiry?product=${id}`}>Küsi pakkumist</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
