
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/product/ProductGrid";
import { getPopularProducts, Product, supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, DollarSign, Users } from "lucide-react";

interface HeroContent {
  title: string | null;
  description: string | null;
  button1: { value: string | null; link: string | null };
  button2: { value: string | null; link: string | null };
  image_url?: string;
}

const fetchHeroContent = async (): Promise<HeroContent> => {
  const { data, error } = await supabase
    .from("website_content")
    .select("key, value, link")
    .eq("page", "home")
    .in("key", ["homepage_title", "homepage_hero_description", "homepage_hero_button1", "homepage_hero_button2"]);

  if (error) {
    throw error;
  }

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

const parseProductCategories = (data: any[]) => {
  const categories = [];
  for (let i = 1; i <= 4; i++) {
    categories.push({
      name: data.find((item) => item.key === `product_category_${i}_name`)?.value || '',
      image: data.find((item) => item.key === `product_category_${i}_image`)?.value || '',
      link: data.find((item) => item.key === `product_category_${i}_link`)?.value || '#',
      button: data.find((item) => item.key === `product_category_${i}_button`)?.value || 'Vaata tooteid',
    });
  }
  return categories;
};

const fetchProductCategoriesContent = async () => {
  const { data, error } = await supabase
    .from('website_content')
    .select('key, value')
    .eq('page', 'home')
    .or('key.ilike.product_category_1_%,key.ilike.product_category_2_%,key.ilike.product_category_3_%,key.ilike.product_category_4_%,key.eq.product_categories_title');
  if (error) throw error;
  return data;
};

const fetchCtaContent = async () => {
  const { data, error } = await supabase
    .from("website_content")
    .select("key, value, link")
    .eq("page", "home")
    .in("key", ["cta_title", "cta_description", "cta_button_text", "cta_button_link"]);
  if (error) throw error;
  const content = {
    cta_title: "Valmis alustama?",
    cta_description: "Võta meiega ühendust ja leiame just teile sobiva lahenduse.",
    cta_button_text: "Küsi pakkumist",
    cta_button_link: "/inquiry"
  };
  data?.forEach(item => {
    if (item.key === "cta_button_link") {
      content.cta_button_link = item.value || item.link || "/inquiry";
    } else {
      content[item.key] = item.value;
    }
  });
  return content;
};

const fetchBannerUrl = async () => {
  const { data, error } = await supabase
    .from("website_content")
    .select("value")
    .eq("page", "homepage")
    .eq("key", "homepage_banner_url")
    .single();
  if (error) return "";
  return data?.value || "";
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized queries to prevent re-renders
  const { data: heroContent, isLoading: isHeroLoading } = useQuery({
    queryKey: ['heroContent'],
    queryFn: fetchHeroContent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const { data: bannerUrl } = useQuery({
    queryKey: ["homepageBannerUrl"],
    queryFn: fetchBannerUrl,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const { data: whyChooseUsData } = useQuery({
    queryKey: ["whyChooseUsContent"],
    queryFn: fetchWhyChooseUsContent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["productCategories"],
    queryFn: fetchProductCategoriesContent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const { data: ctaData } = useQuery({
    queryKey: ["ctaContent"],
    queryFn: fetchCtaContent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  // Memoized parsed data
  const whyChooseUs = useMemo(() => 
    whyChooseUsData ? parseWhyChooseUs(whyChooseUsData) : { title: "", cards: [] },
    [whyChooseUsData]
  );

  const categories = useMemo(() => 
    categoriesData ? parseProductCategories(categoriesData) : [],
    [categoriesData]
  );

  const categoriesTitle = useMemo(() => 
    categoriesData?.find((item: any) => item.key === 'product_categories_title')?.value || 'Meie tooted',
    [categoriesData]
  );

  const ctaContent = useMemo(() => 
    ctaData || {
      cta_title: "Valmis alustama?",
      cta_description: "Võta meiega ühendust ja leiame just teile sobiva lahenduse.",
      cta_button_text: "Küsi pakkumist",
      cta_button_link: "/inquiry"
    },
    [ctaData]
  );

  // Memoized fetch function to prevent re-renders
  const fetchFeaturedProducts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (isHeroLoading || !heroContent) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Laadimine...</div>;
  }

  return (
    <>
      {/* Hero Section - Enhanced for mobile */}
      <section className="py-4 md:py-6">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url('${bannerUrl || ""}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "auto",
              minHeight: "480px" // Slightly smaller on mobile
            }}
          >
            <div className="relative z-10 h-full w-full">
              <div className="flex flex-col md:flex-row items-center justify-between h-full w-full">
                <div className="w-full md:w-2/3 lg:w-1/2 mb-6 md:mb-0 flex flex-col justify-between h-full py-6 md:py-12 px-4 md:px-8">
                  <div className="flex flex-col h-full justify-between">
                    {isHeroLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-10 md:h-12 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="flex gap-3 mt-6">
                          <div className="h-10 bg-gray-200 rounded w-28"></div>
                          <div className="h-10 bg-gray-200 rounded w-28"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-2 md:mt-8">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-6 leading-tight">
                            {heroContent.title}
                          </h1>
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 leading-relaxed">
                            {heroContent.description}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6 mb-4 md:mb-10">
                          <Button 
                            variant="default"
                            size="lg" 
                            className="text-sm md:text-base lg:text-lg !bg-red-500 hover:!bg-red-600 text-white font-medium shadow-md w-full sm:w-auto" 
                            asChild
                          >
                            <Link to="/kontakt">
                              Küsi pakkumist
                            </Link>
                          </Button>
                          <Button 
                            variant="white" 
                            size="lg" 
                            className="text-sm md:text-base lg:text-lg border border-gray-200 shadow-sm w-full sm:w-auto" 
                            asChild
                          >
                            <Link to={heroContent.button2.link || '/tooted'}>
                              {heroContent.button2.value || 'Vaata tooteid'}
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
      <section className="py-8 md:py-12">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-left mb-8 md:mb-12">{whyChooseUs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.cards.length > 0 ? (
              whyChooseUs.cards.map((card, i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary mb-3 md:mb-4">
                    {ICON_MAP[card.icon] || <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-primary" />}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{card.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{card.text}</p>
                </div>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-lg shadow-sm animate-pulse">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded mb-3 md:mb-4"></div>
                  <div className="h-5 md:h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-left mb-8 md:mb-10">{categoriesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, idx) => {
              const imageWithCacheBuster = cat.image ? `${cat.image}?t=${Date.now()}` : '/placeholder.svg';
              return (
                <Link to={cat.link || '#'} key={idx} className="text-center group hover:transform hover:scale-105 transition-all duration-200 block">
                  <div className="h-64 md:h-80 mb-3 md:mb-4 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src={imageWithCacheBuster}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      key={imageWithCacheBuster}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{cat.name}</h3>
                  <Button variant="link" className="text-sm md:text-base pointer-events-none">
                    {cat.button}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-left mb-8 md:mb-12">Populaarsed tooted</h2>
          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-80 md:h-96 rounded"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 md:py-10">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Proovi uuesti
              </Button>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-12 md:py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            {ctaContent.cta_title}
          </h2>
          <p className="text-white text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            {ctaContent.cta_description}
          </p>
          <Button variant="secondary" size="lg" asChild className="text-sm md:text-base">
            <Link to={ctaContent.cta_button_link || "/kontakt"}>
              {ctaContent.cta_button_text}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
