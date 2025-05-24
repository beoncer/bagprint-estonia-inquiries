import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { getPopularProducts, Product, supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, DollarSign, Users } from "lucide-react";

interface HeroContent {
  title: string | null;
  description: string | null;
  button1: { value: string | null; link: string | null };
  button2: { value: string | null; link: string | null };
}

const fetchHeroContent = async (): Promise<HeroContent> => {
  const { data, error } = await supabase
    .from("website_content")
    .select("key, value, link")
    .eq("page", "home")
    .in("key", ["homepage_title", "homepage_hero_description", "homepage_hero_button1", "homepage_hero_button2"]);

  if (error) throw error;

  const content = {
    title: null,
    description: null,
    button1: { value: null, link: null },
    button2: { value: null, link: null }
  };

  data?.forEach(item => {
    switch (item.key) {
      case "homepage_title":
        content.title = item.value;
        break;
      case "homepage_hero_description":
        content.description = item.value;
        break;
      case "homepage_hero_button1":
        content.button1 = { value: item.value, link: item.link };
        break;
      case "homepage_hero_button2":
        content.button2 = { value: item.value, link: item.link };
        break;
    }
  });

  return content;
};

const ICON_MAP: Record<string, JSX.Element> = {
  check: <CheckCircle className="h-12 w-12 text-primary" />,
  dollar: <DollarSign className="h-12 w-12 text-primary" />,
  users: <Users className="h-12 w-12 text-primary" />,
};

const fetchWhyChooseUsContent = async () => {
  const { data, error } = await supabase
    .from("website_content")
    .select("key, value")
    .like("key", "why_choose_us_%");
  if (error) throw error;
  return data;
};

const parseWhyChooseUs = (data: any[]) => {
  const title = data.find((item) => item.key === "why_choose_us_title")?.value || "Miks valida meid";
  // Find all card indexes
  const indexes = Array.from(new Set(
    data
      .map((item) => item.key.match(/^why_choose_us_(\d+)_/))
      .filter(Boolean)
      .map((m) => m![1])
  ));
  const cards = indexes.map((idx) => {
    const icon = data.find((item) => item.key === `why_choose_us_${idx}_icon`)?.value || "check";
    const cardTitle = data.find((item) => item.key === `why_choose_us_${idx}_title`)?.value || "";
    const text = data.find((item) => item.key === `why_choose_us_${idx}_text`)?.value || "";
    return { icon, title: cardTitle, text };
  });
  return { title, cards };
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use React Query for hero content
  const { data: heroContent, isLoading: isHeroLoading } = useQuery({
    queryKey: ['heroContent'],
    queryFn: fetchHeroContent,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const whyChooseUsQuery = useQuery({
    queryKey: ["whyChooseUsContent"],
    queryFn: fetchWhyChooseUsContent,
    staleTime: 1000 * 60 * 5,
  });
  const whyChooseUs = whyChooseUsQuery.data ? parseWhyChooseUs(whyChooseUsQuery.data) : { title: "Miks valida meid", cards: [] };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await getPopularProducts();
        setFeaturedProducts(products);
      } catch (err) {
        setError('Failed to fetch featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

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
              height: "auto",
              minHeight: "520px"
            }}
          >
            <div className="absolute inset-0 bg-white/45"></div>
            <div className="relative z-10 h-full w-full">
              <div className="flex flex-col md:flex-row items-center justify-between h-full w-full">
                <div className="w-full md:w-2/3 lg:w-1/2 mb-8 md:mb-0 flex flex-col justify-between h-full py-8 md:py-12 px-5 md:px-8">
                  <div className="flex flex-col h-full justify-between">
                    {isHeroLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="flex gap-4 mt-6">
                          <div className="h-10 bg-gray-200 rounded w-32"></div>
                          <div className="h-10 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 md:mt-8">
                          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                            {heroContent?.title || "Kvaliteetsed kotid ja pakendid teie brändile"}
                          </h1>
                          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
                            {heroContent?.description || "Leatex pakub laia valikut puuvillakotte, paberkotte, paelaga kotte ja e-poe pakendeid, mida saab kohandada teie brändi logo ja disainiga."}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 md:gap-4 mt-6 mb-6 md:mb-10">
                          <Button 
                            variant="default"
                            size="xl" 
                            className="text-base md:text-lg !bg-red-500 hover:!bg-red-600 text-white font-medium shadow-md" 
                            asChild
                          >
                            <Link to={heroContent?.button1?.link || "/tooted"}>
                              {heroContent?.button1?.value || "Vaata tooteid"}
                            </Link>
                          </Button>
                          <Button 
                            variant="white" 
                            size="xl" 
                            className="text-base md:text-lg border border-gray-200 shadow-sm" 
                            asChild
                          >
                            <Link to={heroContent?.button2?.link || "/paring"}>
                              {heroContent?.button2?.value || "Küsi pakkumist"}
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="hidden md:block md:w-1/3 lg:w-1/2">
                  {/* Optional right side content if needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-2">
          <h2 className="text-3xl font-bold text-left mb-12">{whyChooseUs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUsQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : whyChooseUs.cards.length > 0 ? (
              whyChooseUs.cards.map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-primary mb-4">
                    {ICON_MAP[card.icon] || <CheckCircle className="h-12 w-12 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.text}</p>
                </div>
              ))
            ) : null}
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
                <Link to="/riidest-kotid">Vaata tooteid</Link>
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
                <Link to="/paberkotid">Vaata tooteid</Link>
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
                <Link to="/nooriga-kotid">Vaata tooteid</Link>
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
                <Link to="/sussikotid">Vaata tooteid</Link>
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
            <div className="animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-96 rounded"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
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
