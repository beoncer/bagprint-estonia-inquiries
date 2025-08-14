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
import ProductTechnicalDetails from "@/components/product/ProductTechnicalDetails";
import { PRODUCT_COLORS } from "@/lib/constants";
import ProductStructuredData from "@/components/seo/ProductStructuredData";
import Breadcrumb from "@/components/ui/breadcrumb";
import MagnifyingGlass from "@/components/ui/MagnifyingGlass";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  // Calculator state
  const [quantity, setQuantity] = useState<string>("1");
  const [printType, setPrintType] = useState<string>("without");
  const [colorCount, setColorCount] = useState<number>(1);
  
  // Inquiry form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  // Use the new pricing system
  const { calculatePrice, loading: pricingLoading, quantityMultipliers } = usePricing();
  
  // Update selected image when color or size changes
  useEffect(() => {
    if (product) {
      let newImage = null;
      
      // Priority: 1. Selected color image, 2. Main color image, 3. Size image, 4. Fallback
      if (selectedColor && product.color_images && product.color_images[selectedColor]) {
        newImage = product.color_images[selectedColor];
        console.log('Using selected color image:', newImage);
      } else if (product.main_color && product.color_images && product.color_images[product.main_color]) {
        newImage = product.color_images[product.main_color];
        console.log('Using main color image:', newImage);
      } else if (selectedSize && product.size_images && product.size_images[selectedSize]) {
        newImage = product.size_images[selectedSize];
        console.log('Using size-specific image:', newImage);
      } else if (product.image) {
        newImage = product.image;
        console.log('Using fallback image:', newImage);
      }
      
      setSelectedImage(newImage);
    }
  }, [selectedColor, selectedSize, product]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!slug) throw new Error("No slug provided");
        const productData = await getProductBySlug(slug);
        console.log('Fetched product data:', productData);
        setProduct(productData);
        
        // Set initial color: main_color if set, else first color
        const validColors = productData.colors as string[];
        if (
          productData.main_color &&
          validColors.includes(productData.main_color) &&
          (PRODUCT_COLORS.map(c => c.value) as string[]).includes(productData.main_color)
        ) {
          setSelectedColor(productData.main_color as import('@/lib/constants').ProductColor);
        } else if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
        // Set initial size if product has sizes
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        
        // Set initial image (this will be updated by the color effect)
        if (productData.main_color && productData.color_images && productData.color_images[productData.main_color]) {
          setSelectedImage(productData.color_images[productData.main_color]);
        } else if (productData.image) {
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
    withPrint: printType === "with",
    size: selectedSize,
    product: product
  }) : null;

  // Find the lowest multiplier
  const lowestMultiplier = quantityMultipliers.length > 0 ? Math.min(...quantityMultipliers.map(m => m.multiplier)) : 1;
  const lowestPossiblePrice = product ? product.base_price * lowestMultiplier : undefined;

  // Get color label for display
  const getColorLabel = (colorValue: string) => {
    const colorConfig = PRODUCT_COLORS.find(c => c.value === colorValue);
    return colorConfig?.label || colorValue;
  };

  // Get color style for thumbnails
  const getColorStyle = (colorValue: string) => {
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
      valge: { backgroundColor: '#FFFFFF', border: '2px solid #e5e5e5' },
      granate: { backgroundColor: '#800020' },
      hall: { backgroundColor: '#808080' },
      hele_roheline: { backgroundColor: '#90EE90' },
      kollane: { backgroundColor: '#FFFF00' },
      lilla: { backgroundColor: '#800080' },
      must: { backgroundColor: '#000000' }
    };
    return colorStyles[colorValue] || { backgroundColor: '#CCCCCC' };
  };

  // Handle color thumbnail click
  const handleColorThumbnailClick = (color: string) => {
    console.log('Color thumbnail clicked:', color);
    setSelectedColor(color);
  };
  
  // Build unified thumbnail list: color images, size images, then additional images (no duplicates)
  const unifiedThumbnails: { url: string; type: string; key: string; label?: string }[] = [];
  const urlSet = new Set<string>();
  if (product) {
    // Color images
    if (product.colors && product.color_images) {
      for (const color of product.colors) {
        const url = product.color_images[color];
        if (url && !urlSet.has(url)) {
          unifiedThumbnails.push({ url, type: 'color', key: `color-${color}`, label: getColorLabel(color) });
          urlSet.add(url);
        }
      }
    }
    // Size images
    if (product.sizes && product.size_images) {
      for (const size of product.sizes) {
        const url = product.size_images[size];
        if (url && !urlSet.has(url)) {
          unifiedThumbnails.push({ url, type: 'size', key: `size-${size}`, label: size });
          urlSet.add(url);
        }
      }
    }
    // Additional images
    if (product.additional_images && product.additional_images.length > 0) {
      for (let i = 0; i < product.additional_images.length; i++) {
        const url = product.additional_images[i];
        if (url && !urlSet.has(url)) {
          unifiedThumbnails.push({ url, type: 'additional', key: `additional-${i}` });
          urlSet.add(url);
        }
      }
    }
  }

  // Set SEO meta tags from product SEO fields
  useEffect(() => {
    if (product) {
      document.title = product.seo_title || product.name;
      // Description
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = product.seo_description || product.description || "";
      // Keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = product.seo_keywords || "";
      // Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = product.seo_title || product.name;
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = product.seo_description || product.description || "";
    }
  }, [product]);

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
      {/* Inject structured data for SEO */}
      {product && <ProductStructuredData product={product} price={lowestPossiblePrice} />}
      
      {/* Standardized Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-6">
          <Breadcrumb />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image section */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {selectedImage && (
              <MagnifyingGlass
                src={selectedImage}
                alt={product.name}
                zoomLevel={2.5}
                lensSize={160}
                className="w-full h-full"
              />
            )}
          </div>
          {/* Unified thumbnail gallery */}
          {unifiedThumbnails.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {unifiedThumbnails.map(({ url, key, label }) => (
                <div
                  key={key}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedImage === url ? 'ring-2 ring-red-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                  }`}
                  onClick={() => setSelectedImage(url)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={url}
                      alt={label ? `${product.name} ${label}` : product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedImage === url && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product details section */}
        <div className="space-y-6">
          {/* Title, model and badges */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {/* Display model under the title */}
            {product.model && (
              <p className="text-lg text-gray-600 mt-1">Mudel: {product.model}</p>
            )}
            
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
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Sisestage soovitud kogus"
                  className="w-full bg-white"
                />
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

      <div className="my-12">
        <ProductTechnicalDetails product={product} />
      </div>

      <OrderingFAQSection />
      <OrderingFAQStructuredData />
    </div>
  );
};

export default ProductDetail;
