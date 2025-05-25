import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getProducts, Product } from "@/lib/supabase";

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

const productCategories = [
  {
    id: "cotton_bag",
    name: "Riidest kotid",
    image: "https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop",
    link: "/riidest-kotid"
  },
  {
    id: "paper_bag", 
    name: "Paberkotid",
    image: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop",
    link: "/paberkotid"
  },
  {
    id: "drawstring_bag",
    name: "Nööriga kotid", 
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop",
    link: "/nooriga-kotid"
  },
  {
    id: "shoebag",
    name: "Sussikotid",
    image: "https://images.unsplash.com/photo-1605040742661-bbb75bc29d9a?w=800&auto=format&fit=crop", 
    link: "/sussikotid"
  }
];

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

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-600 mb-8">{error}</p>
          <Button onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Meie tooted</h1>
          <p className="text-gray-600 mb-8">
            Sirvige laia valikut kotte ja pakendeid, mida saate kohandada vastavalt oma brändi vajadustele.
          </p>

          {/* Product Categories Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Tootekategooriad</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {productCategories.map((category) => (
                <Link key={category.id} to={category.link} className="text-center group">
                  <div className="h-60 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
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

          {/* Blog Articles Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Kasulikud artiklid</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.readTime} lugemist</span>
                      <Button variant="link" size="sm" className="p-0">
                        Loe edasi
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={categoryPrettyUrlMap[category.id] || "/tooted"}
                  >
                    <Button
                      variant={activeCategory === category.id ? "default" : "outline"}
                    >
                      {category.name}
                    </Button>
                  </Link>
                ))}
              </div>
              
              {/* Search */}
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
          </div>
          
          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">{error}</h3>
              <p className="text-gray-600 mb-6">Andmete laadimisel tekkis viga. Proovige uuesti.</p>
              <Button onClick={handleRetry}>
                Proovi uuesti
              </Button>
            </div>
          ) : filteredProducts.length > 0 ? (
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
        </div>
      </div>
    </Layout>
  );
};

export default Products;
