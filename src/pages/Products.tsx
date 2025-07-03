import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, ChevronDown, Camera, Shield, Smile, Briefcase, Gift, Truck } from "lucide-react";
import { getProducts, Product, getSiteContent } from "@/lib/supabase";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import FAQStructuredData from "@/components/seo/FAQStructuredData";
import Breadcrumb from "@/components/ui/breadcrumb";

const categories = [
  { id: "all", name: "Kõik tooted" },
  { id: "cotton_bag", name: "Puuvillakotid" },
  { id: "paper_bag", name: "Paberkotid" },
  { id: "drawstring_bag", name: "Paelaga kotid" },
  { id: "packaging", name: "E-poe pakendid" },
];

const categoryPathMap: Record<string, string> = {
  "/riidest-kotid": "cotton_bag",
  "/paberkotid": "paper_bag",
  "/nooriga-kotid": "drawstring_bag",
  "/sussikotid": "shoebag",
  "/tooted": "all",
};

const categoryPrettyUrlMap: Record<string, string> = {
  all: "/tooted",
  cotton_bag: "/riidest-kotid",
  paper_bag: "/paberkotid",
  drawstring_bag: "/nooriga-kotid",
  shoebag: "/sussikotid",
};

const blogArticles = [
  {
    id: 1,
    title: "Kuidas valida õiget kotti oma brändile",
    excerpt: "Praktilised nõuanded sobiva koti valimiseks, mis esindab teie brändi parimatel võimalikult.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Ökoloogilised pakendilahendused",
    excerpt: "Miks on oluline valida keskkonnasõbralikke pakendeid ja kuidas see mõjutab teie brändi mainet.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    readTime: "3 min"
  },
  {
    id: 3,
    title: "Trükikvaliteedi saladused",
    excerpt: "Millised on parimad praktikad kvaliteetse logo ja disaini trükkimiseks kottidele.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop",
    readTime: "4 min"
  }
];

const iconList = [Camera, Shield, Smile, Briefcase, Gift, Truck];

// Add interface for featured blog posts
interface FeaturedBlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  read_time: string;
  created_at: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [guarantees, setGuarantees] = useState<any[]>([]);
  const [guaranteesLoading, setGuaranteesLoading] = useState(true);
  const [guaranteesHeading, setGuaranteesHeading] = useState<string>("");
  const [guaranteesDescription, setGuaranteesDescription] = useState<string>("");
  const [guaranteesContentLoading, setGuaranteesContentLoading] = useState(true);
  
  // Dynamic content state for product pages
  const [productPageContent, setProductPageContent] = useState<Record<string, any>>({});
  const [productPagesLoading, setProductPagesLoading] = useState(true);
  
  // Add state for FAQs
  const [categoryFAQs, setCategoryFAQs] = useState<Record<string, Array<{question: string, answer: string}>>>({});
  const [faqsLoading, setFaqsLoading] = useState(true);

  // Fetch site content for dynamic product categories
  const { data: siteContent, isLoading: siteContentLoading, error: siteContentError } = useQuery({
    queryKey: ['site-content'],
    queryFn: getSiteContent,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Fetch FAQs from Supabase
  useEffect(() => {
    const fetchFAQs = async () => {
      setFaqsLoading(true);
      try {
        console.log('Fetching FAQs...');
        const { data, error } = await supabase
          .from("website_content")
          .select("key, value")
          .eq("page", "product_pages")
          .like("key", "%_faq_%");
        
        if (error) throw error;
        
        console.log('Raw FAQ data from Supabase:', data);

        // Process the FAQ data
        const faqs: Record<string, Array<{question: string, answer: string}>> = {};
        
        if (data) {
          // First, map the short category IDs to full IDs
          const categoryMap: Record<string, string> = {
            'cotton': 'cotton_bag',
            'paper': 'paper_bag',
            'drawstring': 'drawstring_bag',
            'shoebag': 'shoebag'
          };

          data.forEach((row) => {
            // Extract category_id and faq index from the key
            const parts = row.key.split('_');
            const rawCategoryId = parts[0];
            const categoryId = categoryMap[rawCategoryId] || rawCategoryId;
            
            // Initialize the category array if it doesn't exist
            if (!faqs[categoryId]) {
              faqs[categoryId] = [];
            }

            // Handle both FAQ formats
            let faqIndex: number;
            let type: string;

            if (parts.includes('faq')) {
              const faqParts = row.key.split('faq_');
              if (faqParts[1]) {
                const remainingParts = faqParts[1].split('_');
                faqIndex = parseInt(remainingParts[0]);
                type = remainingParts[1] || remainingParts[0];
              }
            } else {
              faqIndex = parseInt(parts[1]);
              type = parts[2];
            }

            console.log('Processing row:', { categoryId, faqIndex, type, value: row.value });
            
            // Make sure we have an array of sufficient length
            while (faqs[categoryId].length <= faqIndex) {
              faqs[categoryId].push({ question: '', answer: '' });
            }
            
            // Handle both question/answer formats
            if (type === 'question' || type.includes('question')) {
              faqs[categoryId][faqIndex].question = row.value;
            } else if (type === 'answer' || type.includes('answer')) {
              faqs[categoryId][faqIndex].answer = row.value;
            }
          });

          // Clean up any incomplete FAQs
          Object.keys(faqs).forEach((categoryId) => {
            faqs[categoryId] = faqs[categoryId].filter(faq => faq.question && faq.answer);
          });
        }
        
        console.log('Processed FAQs:', faqs);
        setCategoryFAQs(faqs);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setFaqsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Fetch featured blog posts
  const { data: featuredBlogPosts, isLoading: featuredBlogLoading } = useQuery({
    queryKey: ['featured-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FeaturedBlogPost[];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Fetch dynamic content for product pages
  useEffect(() => {
    const fetchProductPagesContent = async () => {
      setProductPagesLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "product_pages");
      
      if (data) {
        const content: Record<string, any> = {};
        data.forEach((row: any) => {
          const keyParts = row.key.split('_');
          const field = keyParts.pop();
          const categoryId = keyParts.join('_');
          if (!content[categoryId]) content[categoryId] = {};
          content[categoryId][field] = row.value;
        });
        setProductPageContent(content);
      }
      setProductPagesLoading(false);
    };
    fetchProductPagesContent();
  }, []);

  // Get dynamic content for /tooted page
  const tootedPageContent = siteContent ? {
    heading: siteContent.tooted_page_heading,
    description: siteContent.tooted_page_description,
    blog_section_title: siteContent.tooted_blog_section_title
  } : null;

  console.log('Site content query - Loading:', siteContentLoading, 'Error:', siteContentError, 'Data:', siteContent);

  // Create dynamic product categories from site content - only when data is available
  const productCategories = siteContent ? [
    {
      id: "cotton_bag",
      name: "Riidest kotid",
      image: siteContent.product_category_1_image,
      link: "/riidest-kotid"
    },
    {
      id: "paper_bag", 
      name: "Paberkotid",
      image: siteContent.product_category_2_image,
      link: "/paberkotid"
    },
    {
      id: "drawstring_bag",
      name: "Nööriga kotid", 
      image: siteContent.product_category_3_image,
      link: "/nooriga-kotid"
    },
    {
      id: "shoebag",
      name: "Sussikotid",
      image: siteContent.product_category_4_image,
      link: "/sussikotid"
    }
  ] : null;

  console.log('Final product categories:', productCategories?.map(cat => ({
    id: cat.id,
    name: cat.name,
    image: cat.image,
    isFromSupabase: cat.image && !cat.image.includes('unsplash.com')
  })));
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Handle category filtering from URL params
  useEffect(() => {
    const path = location.pathname;
    let categoryFromPath = categoryPathMap[path];
    if (!categoryFromPath) {
      // fallback to query param logic
      const categoryFromUrl = searchParams.get("category");
      categoryFromPath = categoryFromUrl || "all";
    }
    setActiveCategory(categoryFromPath);
  }, [location.pathname, searchParams]);
  
  // Apply filters when category or search term changes
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (activeCategory !== "all") {
      console.log(`Filtering by category: ${activeCategory}`);
      result = result.filter(product => product.category === activeCategory);
      console.log(`After category filter: ${result.length} products`);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      console.log(`Filtering by search term: ${searchLower}`);
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
      console.log(`After search filter: ${result.length} products`);
    }
    
    console.log("Filtered products:", result);
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);
  
  const handleCategoryChange = (categoryId: string) => {
    console.log("Category changed to:", categoryId);
    if (categoryId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
    setActiveCategory(categoryId);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with term:", searchTerm);
  };
  
  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchGuarantees = async () => {
      setGuaranteesLoading(true);
      const { data, error } = await supabase
        .from("guarantees")
        .select("*")
        .order("order", { ascending: true });
      setGuarantees(data || []);
      setGuaranteesLoading(false);
    };
    fetchGuarantees();
  }, []);

  useEffect(() => {
    const fetchGuaranteesContent = async () => {
      setGuaranteesContentLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "tooted")
        .in("key", ["guarantees_heading", "guarantees_description"]);
      setGuaranteesHeading(data?.find((row: any) => row.key === "guarantees_heading")?.value || "");
      setGuaranteesDescription(data?.find((row: any) => row.key === "guarantees_description")?.value || "");
      setGuaranteesContentLoading(false);
    };
    fetchGuaranteesContent();
  }, []);

  // Get FAQs for the current category
  const getCurrentCategoryFAQs = () => {
    if (activeCategory === "all") return [];
    console.log('Getting FAQs for category:', activeCategory);
    console.log('All FAQs:', categoryFAQs);
    const faqs = categoryFAQs[activeCategory] || [];
    console.log('Current category FAQs:', faqs);
    return faqs;
  };

  // Show filtered products for category pages
  const getCategoryContent = (categoryId: string) => {
    const content = productPageContent[categoryId] || {};
    return {
      title: content.title,
      description: content.description,
      highlight: content.highlight,
      seoTitle: content.seo_title,
      seoDescription: content.seo_description
    };
  };

  const categoryContent = getCategoryContent(activeCategory);

  // Don't render anything until all data is loaded to prevent flash
  if (siteContentLoading || !tootedPageContent || !productCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
        Laadimine...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-96 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-600 mb-8">{error}</p>
        <Button onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  // Show category listing only for /tooted page
  if (location.pathname === "/tooted") {
    // Split heading for colored 'tooted'
    const heading = tootedPageContent.heading || "Meie tooted";
    const split = heading.split(/(tooted)/i);
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section - Portfolio style */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {split.length === 3 ? (
                <>
                  {split[0]}
                  <span className="text-primary">{split[1]}</span>
                  {split[2]}
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {tootedPageContent.description}
            </p>
          </div>

          {/* Product Categories Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Tootekategooriad</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {productCategories.map((category) => (
                <Link key={category.id} to={category.link} className="text-center group">
                  <div className="h-80 md:h-60 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
                      onError={(e) => {
                        console.log(`Image error for category ${category.id}`);
                        console.log(`Failed image URL: ${category.image}`);
                        console.log('Falling back to default image');
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop";
                      }}
                      onLoad={() => {
                        console.log(`Image loaded successfully for category ${category.id}: ${category.image}`);
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <Button variant="link" className="p-0">
                    Vaata tooteid
                  </Button>
                </Link>
              ))}
            </div>
          </section>

          {/* Guarantees Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">{guaranteesContentLoading ? "..." : guaranteesHeading}</h2>
                <p className="text-gray-600 max-w-4xl mx-auto">
                  {guaranteesContentLoading ? "..." : guaranteesDescription}
                </p>
              </div>
              {guaranteesLoading ? (
                <div>Laen garantiiandmeid...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {guarantees.map((guarantee, index) => {
                    const Icon = iconList[index % iconList.length];
                    return (
                      <div key={guarantee.id} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{guarantee.title}</h3>
                          <p className="text-gray-600 text-sm">{guarantee.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Blog Articles Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">{tootedPageContent.blog_section_title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogPosts && featuredBlogPosts.length > 0 ? (
                featuredBlogPosts.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{article.read_time} lugemist</span>
                        <Button variant="link" size="sm" className="p-0">
                          Loe edasi
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">Blogi artikleid pole veel lisatud.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  const currentFAQs = getCurrentCategoryFAQs();

  return (
    <>
      {/* Add FAQ structured data for category pages */}
      <FAQStructuredData faqs={currentFAQs} category={activeCategory} />
      
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Breadcrumb />
          </div>
          
          {/* Hero Section - matching portfolio style */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {categoryContent.highlight && categoryContent.title.includes(categoryContent.highlight) ? (
                <>
                  {categoryContent.title.split(categoryContent.highlight)[0]}
                  <span className="text-primary">{categoryContent.highlight}</span>
                  {categoryContent.title.split(categoryContent.highlight)[1]}
                </>
              ) : categoryContent.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {categoryContent.description}
            </p>
          </div>
          
          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
            <div className="w-full md:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Otsi tooteid..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </form>
            </div>
          </div>
          
          {/* Results */}
          {filteredProducts.length > 0 ? (
            <>
              <p className="mb-6">Leitud {filteredProducts.length} toodet</p>
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Tooteid ei leitud</h3>
              <p className="text-gray-600 mb-6">Proovige muuta otsingufiltrit või sirvige kõiki tooteid</p>
              <Button onClick={() => {
                setSearchTerm("");
                handleCategoryChange("all");
              }}>
                Näita kõiki tooteid
              </Button>
            </div>
          )}

          {/* FAQ Section - only show if there are FAQs for this category */}
          {activeCategory !== "all" && (
            <section className="mt-20 mb-16">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Korduma kippuvad küsimused</h2>
                {faqsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-16 bg-gray-100 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {getCurrentCategoryFAQs().length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {getCurrentCategoryFAQs().map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-center text-gray-500">Sellele kategooriale pole veel KKK-sid lisatud.</p>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Guarantees Section */}
          <section className="mt-20 mb-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">{guaranteesContentLoading ? "..." : guaranteesHeading}</h2>
                <p className="text-gray-600 max-w-4xl mx-auto">
                  {guaranteesContentLoading ? "..." : guaranteesDescription}
                </p>
              </div>
              {guaranteesLoading ? (
                <div>Laen garantiiandmeid...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {guarantees.map((guarantee, index) => {
                    const Icon = iconList[index % iconList.length];
                    return (
                      <div key={guarantee.id} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{guarantee.title}</h3>
                          <p className="text-gray-600 text-sm">{guarantee.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Products;
