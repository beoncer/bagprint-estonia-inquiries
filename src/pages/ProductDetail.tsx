
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
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
        // Set initial size if product has sizes
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image section */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Product details section */}
        <div className="space-y-8">
          {/* Title and badges */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">Kategooria: {product.category}</p>
            
            {product.badges && product.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <ProductBadge key={badge} type={badge as BadgeType} />
                ))}
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Product options section */}
          <div className="space-y-6">
            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <Label>Suurus</Label>
                <Select
                  value={selectedSize || ""}
                  onValueChange={setSelectedSize}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Vali suurus" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <Label>Värv</Label>
                <ColorPicker
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              </div>
            )}
          </div>

          {/* Calculator section */}
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Arvuta hind</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Kogus</Label>
                <Select
                  value={quantity}
                  onValueChange={(value) => setQuantity(value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Vali kogus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Trüki tüüp</Label>
                <Select
                  value={printType}
                  onValueChange={(value) => {
                    setPrintType(value);
                    setWithPrint(value === "with");
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Vali trüki tüüp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without">Ilma trükita</SelectItem>
                    <SelectItem value="with">Trükiga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span>Hind/tk:</span>
                  <span className="font-semibold">{pricePerItem.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-2">
                  <span>Kokku:</span>
                  <span>{calculatedPrice.toFixed(2)} €</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  * Hinnad on indikatiivsed ja ei sisalda käibemaksu
                </p>
              </div>

              <Button className="w-full" size="lg">
                Küsi pakkumist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OrderingFAQSection />
      <OrderingFAQStructuredData />
    </div>
  );
};

export default ProductDetail;
