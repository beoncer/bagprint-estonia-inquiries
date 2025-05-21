
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductProps } from "@/components/product/ProductCard";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  type: string;
  pricing_without_print: Json;
  pricing_with_print: Json;
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Log to debug
      console.log("Fetching products...");
      
      const { data, error } = await supabase.from("products").select("*");
      
      if (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Could not load products. Please try again later."
        });
        return;
      }
      
      console.log("Raw products data:", data);
      
      if (data && data.length > 0) {
        // Process the products data
        const processedProducts: ProductProps[] = data.map((product: Product) => {
          console.log("Processing product:", product.name, "Type:", product.type);
          
          // Parse pricing objects if needed
          let pricingWithoutPrint: Record<string, number> = {};
          
          try {
            if (typeof product.pricing_without_print === 'string') {
              pricingWithoutPrint = JSON.parse(product.pricing_without_print);
            } else if (product.pricing_without_print && typeof product.pricing_without_print === 'object') {
              // Handle case when it's already an object
              pricingWithoutPrint = product.pricing_without_print as Record<string, number>;
            }
            
            console.log("Pricing data for", product.name, ":", pricingWithoutPrint);
            
            // Calculate starting price (minimum price from pricing_without_print)
            const priceValues = Object.values(pricingWithoutPrint || {}).map(p => Number(p));
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
              image: product.image_url || "/placeholder.svg", // Use placeholder if no image
              category,
              startingPrice,
            };
          } catch (err) {
            console.error(`Error processing product ${product.name}:`, err);
            // Return a default product with error indication
            return {
              id: product.id,
              name: product.name,
              description: product.description || "Error loading product details",
              image: "/placeholder.svg",
              category: "other",
              startingPrice: 0,
            };
          }
        });
        
        console.log("Processed products:", processedProducts);
        setAllProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } else {
        console.log("No products found");
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error processing products:", err);
      toast({
        variant: "destructive",
        title: "Error processing products",
        description: "There was a problem preparing the products for display."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle category filtering from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory("all");
    }
  }, [searchParams]);
  
  // Apply filters when category or search term changes
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let result = [...allProducts];
    
    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, allProducts]);
  
  const handleCategoryChange = (categoryId: string) => {
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
    // The filtering is already handled by the useEffect
  };

  const categories = [
    { id: "all", name: "Kõik tooted" },
    { id: "cotton", name: "Puuvillakotid" },
    { id: "paper", name: "Paberkotid" },
    { id: "drawstring", name: "Paelaga kotid" },
    { id: "packaging", name: "E-poe pakendid" },
  ];

  // Insert debug log to check products
  console.log("All Products State:", allProducts);
  console.log("Filtered Products State:", filteredProducts);

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
