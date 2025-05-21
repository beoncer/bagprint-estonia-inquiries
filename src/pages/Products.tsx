
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductProps } from "@/components/product/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { fetchAllProducts, fallbackProducts } from "@/utils/productUtils";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const { toast } = useToast();
  
  // Load products on component mount
  useEffect(() => {
    console.log("Products component mounted");
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setLoadError(null);
    setUseFallback(false);
    
    try {
      console.log("Starting to load products in Products.tsx");
      const products = await fetchAllProducts();
      console.log("Products loaded in Products.tsx:", products);
      
      if (!products || products.length === 0) {
        console.log("No products returned from fetchAllProducts");
        
        // Show a different message when in development mode
        if (import.meta.env.MODE === 'development') {
          setUseFallback(true);
          setLoadError(null);
          
          toast({
            title: "Using demo products",
            description: "No products found in database. Using demo products for development."
          });
          
          // Set fallback products
          setAllProducts(fallbackProducts);
          setFilteredProducts(fallbackProducts);
        } else {
          setLoadError("No products found. Please check back later.");
          toast({
            variant: "destructive",
            title: "No products found",
            description: "We couldn't find any products. Please check back later."
          });
          
          setAllProducts([]);
          setFilteredProducts([]);
        }
      } else {
        setLoadError(null);
        setUseFallback(false);
        
        toast({
          title: `${products.length} products loaded`,
          description: "Products loaded successfully."
        });
        
        setAllProducts(products);
        setFilteredProducts(products);
      }
    } catch (err) {
      console.error("Error in Products component:", err);
      
      // In development mode, use fallback products
      if (import.meta.env.MODE === 'development') {
        console.log("Using fallback products after error");
        setUseFallback(true);
        setLoadError(null);
        
        toast({
          variant: "warning",
          title: "Database error",
          description: "Error connecting to database. Using demo products for development."
        });
        
        setAllProducts(fallbackProducts);
        setFilteredProducts(fallbackProducts);
      } else {
        setLoadError("Failed to load products. Please try refreshing the page.");
        
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Could not load products. Please try again later."
        });
        
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle category filtering from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      console.log("Category from URL:", categoryFromUrl);
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory("all");
    }
  }, [searchParams]);
  
  // Apply filters when category or search term changes
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) return;
    
    console.log("Applying filters:", { activeCategory, searchTerm });
    console.log("All products before filtering:", allProducts);
    
    let result = [...allProducts];
    
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
  }, [activeCategory, searchTerm, allProducts]);
  
  const handleCategoryChange = (categoryId: string) => {
    console.log("Category changed to:", categoryId);
    if (categoryId === "all") {
      // Remove category param if "all" is selected
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
    // The filtering is already handled by the useEffect
  };
  
  const handleRetry = () => {
    console.log("Retrying product load...");
    loadProducts();
  };

  const categories = [
    { id: "all", name: "Kõik tooted" },
    { id: "cotton", name: "Puuvillakotid" },
    { id: "paper", name: "Paberkotid" },
    { id: "drawstring", name: "Paelaga kotid" },
    { id: "packaging", name: "E-poe pakendid" },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Meie tooted</h1>
          <p className="text-gray-600 mb-8">
            Sirvige laia valikut kotte ja pakendeid, mida saate kohandada vastavalt oma brändi vajadustele.
          </p>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </Button>
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
          ) : loadError ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">{loadError}</h3>
              <p className="text-gray-600 mb-6">Andmete laadimisel tekkis viga. Proovige uuesti.</p>
              <Button onClick={handleRetry}>
                Proovi uuesti
              </Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {useFallback && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-amber-700">
                    <strong>Arendusrežiim:</strong> Näidistoodete andmed. Ühendage Supabase andmebaasiga või lisage tooteid andmebaasi.
                  </p>
                </div>
              )}
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
