
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      ]
    }
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  
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
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Alates</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {product.pricing.withoutPrint[product.pricing.withoutPrint.length - 1].price.toFixed(2)} €
                </span>
                <span className="text-gray-500">/ tk (ilma trükita)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                * Hind sõltub kogusest ja trüki valikutest
              </p>
            </div>
            
            <div className="space-y-6">
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link to={`/inquiry?product=${product.id}`}>
                  Küsi pakkumist
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="info">Toote info</TabsTrigger>
              <TabsTrigger value="pricing">Hinnad</TabsTrigger>
              <TabsTrigger value="printing">Trüki info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="pt-4">
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
            </TabsContent>
            
            <TabsContent value="pricing" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Hinnad ilma trükita</h3>
                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Kogus</th>
                        <th>Hind / tk (€)</th>
                        <th>Kokku (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.pricing.withoutPrint.map((item: any) => (
                        <tr key={item.quantity}>
                          <td>{item.quantity} tk</td>
                          <td>{item.price.toFixed(2)} €</td>
                          <td>{(item.quantity * item.price).toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Hinnad koos trükiga</h3>
                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Kogus</th>
                        <th>Hind / tk (€)</th>
                        <th>Kokku (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.pricing.withPrint.map((item: any) => (
                        <tr key={item.quantity}>
                          <td>{item.quantity} tk</td>
                          <td>{item.price.toFixed(2)} €</td>
                          <td>{(item.quantity * item.price).toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                * Hinnad on indikatiivsed ja võivad varieeruda sõltuvalt trüki värvilisusest, suurusest ja muudest teguritest. Täpse pakkumise saamiseks palun kasutage pakkumise küsimise vormi.
              </p>
            </TabsContent>
            
            <TabsContent value="printing" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Trükkimisvõimalused</h3>
                  <p className="mb-4">
                    Pakume mitmeid erinevaid trükkimisvõimalusi, et täita teie ettevõtte vajadused:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Siiditrükk - ideaalne suuremate koguste jaoks</li>
                    <li>Transfertrükk - sobib detailsete kujunduste jaoks</li>
                    <li>Flock-trükk - annab tekstuurse, veidi reljeefsena tunduva tulemuse</li>
                    <li>Flex-trükk - vastupidav ja elastne</li>
                    <li>Digitrükk - väiksemate koguste ja värviliste kujunduste jaoks</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Trüki ettevalmistus</h3>
                  <p className="mb-4">
                    Trükkimiseks vajame teie logo või kujunduse vektor-formaadis failina (.ai, .eps, .pdf või .svg).
                  </p>
                  <p className="mb-4">
                    Kui teil pole vektor-formaati, võime aidata teie olemasoleva logo konvertimisega.
                  </p>
                  <p>
                    Trüki värvid saame kohandada vastavalt teie ettevõtte stiilile (Pantone või CMYK).
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
