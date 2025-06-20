
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
import { Textarea } from "@/components/ui/textarea";
import { usePricing } from "@/hooks/usePricing";

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
  const [colorCount, setColorCount] = useState<number>(1);
  
  // Inquiry form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  // Use the new pricing system
  const { calculatePrice, loading: pricingLoading } = usePricing();
  
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
  
  // Calculate price using the new system
  const priceResult = product ? calculatePrice({
    basePrice: product.base_price,
    quantity: parseInt(quantity),
    colorCount: printType === "with" ? colorCount : 0,
    withPrint: printType === "with"
  }) : null;
  
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
        <div className="space-y-6">
          {/* Title and badges */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {product.badges && product.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <ProductBadge key={badge} type={badge as BadgeType} />
                ))}
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Product options section */}
          <div className="space-y-4">
            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Suurus</Label>
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
              <ColorPicker
                colors={product.colors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            )}
          </div>

          {/* Calculator section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Arvuta hind</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Kogus</Label>
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
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Trüki tüüp</Label>
                <Select
                  value={printType}
                  onValueChange={(value) => setPrintType(value)}
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

              {printType === "with" && (
                <div className="space-y-2">
                  <Label className="text-sm">Värvide arv</Label>
                  <Select
                    value={colorCount.toString()}
                    onValueChange={(value) => setColorCount(parseInt(value))}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Vali värvide arv" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} värv{count > 1 ? 'i' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-3 border-t">
                {!pricingLoading && priceResult && (
                  <>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Põhihind:</span>
                        <span>€{priceResult.basePrice.toFixed(2)}</span>
                      </div>
                      {priceResult.breakdown.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Koguse allahindlus:</span>
                          <span>-€{priceResult.breakdown.discount.toFixed(2)}</span>
                        </div>
                      )}
                      {priceResult.printCost > 0 && (
                        <div className="flex justify-between">
                          <span>Trükikulu:</span>
                          <span>€{priceResult.printCost.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t">
                      <span>Hind/tk:</span>
                      <span className="font-semibold">€{priceResult.pricePerItem.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold mt-1">
                      <span>Kokku:</span>
                      <span>€{priceResult.totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  * Hinnad on indikatiivsed ja ei sisalda käibemaksu
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Input
                  placeholder="Nimi*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="E-mail*"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            
            <Input
              placeholder="Telefoninumber*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white"
            />
            
            <Textarea
              placeholder="Lisainformatsioon*"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white min-h-[100px]"
            />

            <Button className="w-full" size="lg">
              Küsi pakkumist
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Tellimus läheb töössse ainult peale pakkumise ja digitaalse mustandi kinnitust.
            </p>
          </div>
        </div>
      </div>

      <OrderingFAQSection />
      <OrderingFAQStructuredData />
    </div>
  );
};

export default ProductDetail;
