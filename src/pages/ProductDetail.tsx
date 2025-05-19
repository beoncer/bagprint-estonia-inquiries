
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample product data - this would come from the backend in the real implementation
const products = [
  {
    id: "cotton1",
    name: "Standard puuvillakott",
    description: "Kõrgkvaliteedilised puuvillakotid, mis on vastupidavad ja keskkonnasõbralikud. Need kotid sobivad ideaalselt igapäevaseks kasutamiseks, üritusteks või ettevõtte kingitusteks. Saadaval erinevates värvides.",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624024690655-7ed9f4f7b0f1?w=800&auto=format&fit=crop"
    ],
    category: "cotton",
    specifications: {
      material: "100% puuvill",
      size: "38 x 42 cm",
      weight: "140g/m²",
      handleLength: "70 cm",
      printArea: "A4 (21 x 29,7 cm)",
      colors: ["Valge", "Must", "Naturaalne", "Sinine", "Punane"]
    },
    pricing: {
      withoutPrint: [
        { quantity: 50, price: 1.90 },
        { quantity: 100, price: 1.80 },
        { quantity: 200, price: 1.70 },
        { quantity: 500, price: 1.60 },
        { quantity: 1000, price: 1.50 }
      ],
      withPrint: [
        { quantity: 50, price: 2.90 },
        { quantity: 100, price: 2.70 },
        { quantity: 200, price: 2.50 },
        { quantity: 500, price: 2.30 },
        { quantity: 1000, price: 2.10 }
      ],
      colorSurcharge: [
        { colors: 0, surcharge: 0 },
        { colors: 1, surcharge: 0.3 },
        { colors: 2, surcharge: 0.5 },
        { colors: 3, surcharge: 0.7 },
        { colors: 4, surcharge: 0.9 },
        { colors: 5, surcharge: 1.1 },
        { colors: 6, surcharge: 1.3 },
        { colors: 7, surcharge: 1.5 },
        { colors: 8, surcharge: 1.7 }
      ]
    }
  },
  {
    id: "paper1",
    name: "Paberkott - väike",
    description: "Keskkonnasõbralikud väikesed paberkotid, mis on valmistatud kvaliteetsest paberist. Sobivad ideaalselt väiksemate toodete jaoks, kingituste pakkimiseks või ürituste meeneteks.",
    images: [
      "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop"
    ],
    category: "paper",
    specifications: {
      material: "Kraftpaber",
      size: "22 x 18 x 8 cm",
      paperWeight: "100g/m²",
      handleType: "Keeratud paber",
      printArea: "15 x 10 cm",
      colors: ["Pruun", "Valge"]
    },
    pricing: {
      withoutPrint: [
        { quantity: 50, price: 1.20 },
        { quantity: 100, price: 1.10 },
        { quantity: 200, price: 1.00 },
        { quantity: 500, price: 0.90 },
        { quantity: 1000, price: 0.80 }
      ],
      withPrint: [
        { quantity: 50, price: 2.20 },
        { quantity: 100, price: 2.00 },
        { quantity: 200, price: 1.80 },
        { quantity: 500, price: 1.60 },
        { quantity: 1000, price: 1.40 }
      ],
      colorSurcharge: [
        { colors: 0, surcharge: 0 },
        { colors: 1, surcharge: 0.3 },
        { colors: 2, surcharge: 0.5 },
        { colors: 3, surcharge: 0.7 },
        { colors: 4, surcharge: 0.9 },
        { colors: 5, surcharge: 1.1 },
        { colors: 6, surcharge: 1.3 },
        { colors: 7, surcharge: 1.5 },
        { colors: 8, surcharge: 1.7 }
      ]
    }
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  
  // Calculator state
  const [quantity, setQuantity] = useState<number>(100);
  const [printColors, setPrintColors] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [pricePerItem, setPricePerItem] = useState<number>(0);
  
  useEffect(() => {
    // Simulate API call to get product details
    const fetchProduct = () => {
      setLoading(true);
      // Find the product by ID
      const foundProduct = products.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
      }
      
      setLoading(false);
    };
    
    fetchProduct();
  }, [id]);
  
  useEffect(() => {
    if (product) {
      calculatePrice(quantity, printColors);
    }
  }, [quantity, printColors, product]);
  
  const calculatePrice = (qty: number, colors: number) => {
    if (!product) return;
    
    let basePrice = 0;
    let pricingList = printColors > 0 ? product.pricing.withPrint : product.pricing.withoutPrint;
    
    // Find the appropriate price bracket based on quantity
    for (let i = 0; i < pricingList.length; i++) {
      if (qty <= pricingList[i].quantity || i === pricingList.length - 1) {
        basePrice = pricingList[i].price;
        break;
      }
    }
    
    // Add color surcharge if applicable
    let colorPrice = 0;
    if (colors > 0 && product.pricing.colorSurcharge) {
      const colorSurcharge = product.pricing.colorSurcharge.find(c => c.colors === colors);
      if (colorSurcharge) {
        colorPrice = colorSurcharge.surcharge;
      }
    }
    
    const totalPricePerItem = basePrice + colorPrice;
    setPricePerItem(totalPricePerItem);
    setCalculatedPrice(totalPricePerItem * qty);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
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
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Toodet ei leitud</h2>
          <p className="mb-8">Kahjuks ei leidnud me otsitud toodet. Proovige vaadata teisi tooteid.</p>
          <Button asChild>
            <Link to="/products">Tagasi toodete juurde</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Avaleht</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Tooted</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <div className="mb-4 aspect-square overflow-hidden rounded-lg">
              <img 
                src={selectedImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer
                    ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info and Calculator */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Price Calculator */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-semibold mb-4">Arvuta hind</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity" className="mb-2 block">Kogus</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="50" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="print-colors" className="mb-2 block">Trüki värvid</Label>
                  <Select 
                    value={printColors.toString()} 
                    onValueChange={(value) => setPrintColors(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Vali värvide arv" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ilma trükita</SelectItem>
                      <SelectItem value="1">1 värv</SelectItem>
                      <SelectItem value="2">2 värvi</SelectItem>
                      <SelectItem value="3">3 värvi</SelectItem>
                      <SelectItem value="4">4 värvi</SelectItem>
                      <SelectItem value="5">5 värvi</SelectItem>
                      <SelectItem value="6">6 värvi</SelectItem>
                      <SelectItem value="7">7 värvi</SelectItem>
                      <SelectItem value="8">8 värvi</SelectItem>
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
                <Link to={`/inquiry?product=${product.id}&quantity=${quantity}&colors=${printColors}`}>
                  Küsi pakkumist
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Specifications */}
        <div className="mt-16">
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
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
