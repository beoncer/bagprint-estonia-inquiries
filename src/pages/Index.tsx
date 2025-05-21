
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductProps } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  type: string;
  pricing_without_print: Json;
  pricing_with_print: Json;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      // Fetch popular products from the join table
      const { data: popularData, error: popularError } = await supabase
        .from('popular_products')
        .select('product_id');
      
      if (popularError) {
        console.error('Error fetching popular products:', popularError);
        return;
      }
      
      if (popularData && popularData.length > 0) {
        // Extract product IDs
        const productIds = popularData.map(item => item.product_id);
        
        // Fetch the actual product details
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        
        if (productsError) {
          console.error('Error fetching product details:', productsError);
          return;
        }
        
        if (productsData) {
          // Process the products data
          const processedProducts: ProductProps[] = productsData.map((product: Product) => {
            // Parse JSON pricing if stored as string
            const pricingWithoutPrint = typeof product.pricing_without_print === 'string' 
              ? JSON.parse(product.pricing_without_print as string)
              : product.pricing_without_print as Record<string, number>;
            
            // Calculate starting price
            const priceValues = Object.values(pricingWithoutPrint as Record<string, number>);
            const startingPrice = priceValues.length > 0 
              ? Math.min(...priceValues) 
              : 0;
            
            // Map product type to category
            let category: string;
            switch (product.type) {
              case "cotton_bag": category = "cotton"; break;
              case "paper_bag": category = "paper"; break;
              case "drawstring_bag": category = "drawstring"; break;
              case "packaging_box": category = "packaging"; break;
              default: category = "other";
            }
            
            return {
              id: product.id,
              name: product.name,
              description: product.description || "",
              image: product.image_url || "/placeholder.svg",
              category,
              startingPrice,
            };
          });
          
          setFeaturedProducts(processedProducts);
        }
      }
    } catch (err) {
      console.error('Error processing popular products:', err);
    } finally {
      setLoading(false);
    }
  };

  // If no popular products are fetched, use this fallback data
  const fallbackProducts = [
    {
      id: "cotton1",
      name: "Standard puuvillakott",
      description: "Kõrgkvaliteedilised puuvillakotid. Saadaval erinevates värvides.",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
      category: "cotton",
      startingPrice: 1.50
    },
    {
      id: "paper1",
      name: "Paberkott - väike",
      description: "Keskkonnasõbralikud väikesed paberkotid.",
      image: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop",
      category: "paper",
      startingPrice: 0.80
    },
    {
      id: "drawstring1",
      name: "Paelaga kott",
      description: "Praktilised paelaga kotid. Ideaalsed üritusteks.",
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop",
      category: "drawstring",
      startingPrice: 1.20
    },
    {
      id: "bag1",
      name: "Sussikott",
      description: "Kvaliteetsed ja vastupidavad sussikotid.",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop",
      category: "shoebag",
      startingPrice: 1.40
    }
  ];

  // Use real data if available, otherwise use fallback
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-6">
        <div className="container mx-auto px-2">
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
            style={{
              backgroundImage: "url('/lovable-uploads/df14f86d-deb5-425a-bbf5-22630946d650.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "520px"
            }}
          >
            <div className="absolute inset-0 bg-white/45"></div>
            <div className="relative z-10 h-full">
              <div className="flex flex-col md:flex-row items-center justify-between h-full">
                <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col justify-between h-full py-6 md:py-10 px-4 md:px-6">
                  {/* Content container with better spacing distribution */}
                  <div className="flex flex-col h-full justify-between">
                    {/* Text content */}
                    <div className="mt-6 md:mt-10">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                        Kvaliteetsed kotid ja pakendid teie brändile
                      </h1>
                      <p className="text-lg md:text-xl text-gray-600 mb-6">
                        Leatex pakub laia valikut puuvillakotte, paberkotte, paelaga kotte ja 
                        e-poe pakendeid, mida saab kohandada teie brändi logo ja disainiga.
                      </p>
                    </div>
                    
                    {/* Buttons with consistent sizing */}
                    <div className="flex flex-wrap gap-3 md:gap-4 mt-auto mb-6 md:mb-10">
                      <Button 
                        size="lg" 
                        className="text-base md:text-xl h-auto py-3 px-6 md:px-8" 
                        asChild
                      >
                        <Link to="/products">Vaata tooteid</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="text-base md:text-xl h-auto py-3 px-6 md:px-8 bg-white" 
                        asChild
                      >
                        <Link to="/inquiry">Küsi pakkumist</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-2">
          <h2 className="text-3xl font-bold text-left mb-12">Miks valida meid</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kõrge kvaliteet</h3>
              <p className="text-gray-600">
                Kasutame ainult kvaliteetseid materjale, et tagada meie toodete vastupidavus ja esteetiline välimus.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Konkurentsivõimelised hinnad</h3>
              <p className="text-gray-600">
                Pakume parimaid hindu, säilitades samal ajal toote kõrge kvaliteedi ja klienditeeninduse.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personaalne teenindus</h3>
              <p className="text-gray-600">
                Iga klient on meile oluline. Pakume personaalset lähenemist ja professionaalset nõustamist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-2">
          <h2 className="text-3xl font-bold text-left mb-10">Meie tooted</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-60 mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop"
                  alt="Riidest kotid"
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Riidest kotid</h3>
              <Button variant="link" asChild>
                <Link to="/products?category=cotton">Vaata tooteid</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="h-60 mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop" 
                  alt="Paberkotid"
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paberkotid</h3>
              <Button variant="link" asChild>
                <Link to="/products?category=paper">Vaata tooteid</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="h-60 mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop" 
                  alt="Nööriga kotid"
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nööriga kotid</h3>
              <Button variant="link" asChild>
                <Link to="/products?category=drawstring">Vaata tooteid</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="h-60 mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1605040742661-bbb75bc29d9a?w=800&auto=format&fit=crop" 
                  alt="Sussikotid"
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sussikotid</h3>
              <Button variant="link" asChild>
                <Link to="/products?category=shoebag">Vaata tooteid</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-2">
          <h2 className="text-3xl font-bold text-left mb-12">Populaarsed tooted</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <ProductGrid products={productsToShow} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-2 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Valmis alustama?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Võta meiega ühendust ja leiame just teile sobiva lahenduse.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/inquiry">Küsi pakkumist</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
