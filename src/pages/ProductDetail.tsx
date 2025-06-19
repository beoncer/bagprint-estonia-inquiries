import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProductBySlug, Product } from "@/lib/supabase";
import OrderingFAQSection from "@/components/seo/OrderingFAQSection";
import OrderingFAQStructuredData from "@/components/seo/OrderingFAQStructuredData";
import ColorPicker from "@/components/product/ColorPicker";
import EcoBadge from "@/components/product/EcoBadge";
import { ProductBadge } from "@/components/product/ProductBadge";
import { BadgeType } from "@/lib/badge-constants";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Calculator state
  const [quantity, setQuantity] = useState<string>("50");
  const [printType, setPrintType] = useState<string>("without");
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [pricePerItem, setPricePerItem] = useState<number>(0);
  const [withPrint, setWithPrint] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!slug) throw new Error("No slug provided");
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        // Set initial color if product has colors
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        // Set initial image
        if (productData.image) {
          setSelectedImage(productData.image);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);
  
  useEffect(() => {
    if (product && quantity) {
      const basePrice = withPrint
        ? product.pricing_with_print[quantity]
        : product.pricing_without_print[quantity];

      if (basePrice) {
        const total = parseFloat(quantity) * basePrice;
        setCalculatedPrice(total);
        setPricePerItem(basePrice);
      }
    }
  }, [product, quantity, withPrint]);
  
  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-200 h-96 rounded"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Toodet ei leitud</h2>
        <p className="mb-8">Kahjuks ei leidnud me otsitud toodet. Proovige vaadata teisi tooteid.</p>
        <Button asChild>
          <Link to="/tooted">Tagasi toodete juurde</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-10">
      <OrderingFAQStructuredData />
      
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Avaleht</Link>
        <span className="mx-2">/</span>
        <Link to="/tooted" className="hover:text-primary">Tooted</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product?.name}</span>
      </div>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg">
            <img 
              src={selectedImage || product?.image} 
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Product Info and Calculator */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
          <p className="text-gray-500 mb-4">Kategooria: {product?.category}</p>
          {product?.is_eco && <EcoBadge />}
          <p className="text-primary font-medium">
            Alates {product?.startingPrice !== undefined ? product?.startingPrice.toFixed(2) + ' €' : 'Hind puudub'}
          </p>
          <div className="flex flex-col gap-4 mb-6">
            {/* Display badges if they exist */}
            {product?.badges && product.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <ProductBadge key={badge} type={badge as BadgeType} />
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap break-words max-w-full">
            {product?.description}
          </p>
          
          {/* Color Picker */}
          {product?.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <ColorPicker
                selectedColor={selectedColor}
                availableColors={product.colors}
                onColorChange={setSelectedColor}
              />
            </div>
          )}
          
          {/* Price Calculator */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">Arvuta hind</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="mb-2 block">Kogus</Label>
                <Select 
                  value={quantity} 
                  onValueChange={(value) => setQuantity(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vali kogus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="print-type" className="mb-2 block">Trüki tüüp</Label>
                <Select 
                  value={printType} 
                  onValueChange={(value) => {
                    setPrintType(value);
                    setWithPrint(value === "with");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vali trüki tüüp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without">Ilma trükita</SelectItem>
                    <SelectItem value="with">Trükiga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Hind/tk:</span>
                  <span className="font-medium">{pricePerItem.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Kokku:</span>
                  <span className="text-xl font-bold text-primary">{calculatedPrice.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">* Hinnad on indikatiivsed ja ei sisalda käibemaksu</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Button size="lg" className="w-full md:w-auto" asChild>
              <Link to={`/inquiry?product=${product?.id}&quantity=${quantity}&printType=${printType}&selectedColor=${selectedColor}`}>
                Küsi pakkumist
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Specifications */}
      {/* <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4">Spetsifikatsioonid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => {
                  if (key !== 'colors') {
                    return (
                      <tr key={key} className="border-b">
                        <td className="py-3 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                        <td className="py-3">{value as string}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h4 className="font-medium mb-2">Saadaval värvid:</h4>
            <div className="flex flex-wrap gap-2">
              {product.specifications.colors.map((color: string) => (
                <span key={color} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      
      {/* Add the FAQ section at the bottom */}
      <OrderingFAQSection />
    </div>
  );
};

export default ProductDetail;
