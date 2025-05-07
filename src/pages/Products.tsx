
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample product data - this would come from the backend in the real implementation
const allProducts = [
  {
    id: "cotton1",
    name: "Standard puuvillakott",
    description: "Kõrgkvaliteedilised puuvillakotid. Saadaval erinevates värvides.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    category: "cotton",
    startingPrice: 1.50
  },
  {
    id: "cotton2",
    name: "Premium puuvillakott",
    description: "Luksuslikud paksud puuvillakotid. Parim kvaliteet teie brändile.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop",
    category: "cotton",
    startingPrice: 2.20
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
    id: "paper2",
    name: "Paberkott - suur",
    description: "Tugevad ja keskkonnasõbralikud suured paberkotid.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop",
    category: "paper",
    startingPrice: 1.10
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
    id: "box1",
    name: "E-poe karp - väike",
    description: "Kompaktsed karbid väiksemate toodete jaoks.",
    image: "https://images.unsplash.com/photo-1605040742661-bbb75bc29d9a?w=800&auto=format&fit=crop",
    category: "packaging",
    startingPrice: 0.90
  },
  {
    id: "box2",
    name: "E-poe karp - keskmine",
    description: "Universaalsed keskmise suurusega e-poe karbid.",
    image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800&auto=format&fit=crop",
    category: "packaging",
    startingPrice: 1.30
  },
  {
    id: "box3",
    name: "E-poe karp - suur",
    description: "Suured ja tugevad karbid mahukate toodete jaoks.",
    image: "https://images.unsplash.com/photo-1575486234793-56385db1ed9f?w=800&auto=format&fit=crop",
    category: "packaging",
    startingPrice: 1.80
  },
];

const categories = [
  { id: "all", name: "Kõik tooted" },
  { id: "cotton", name: "Puuvillakotid" },
  { id: "paper", name: "Paberkotid" },
  { id: "drawstring", name: "Paelaga kotid" },
  { id: "packaging", name: "E-poe pakendid" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  
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
    let result = allProducts;
    
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
  }, [activeCategory, searchTerm]);
  
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

  return (
    <Layout>
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Meie tooted</h1>
          <p className="text-gray-600 mb-8">
            Vaata meie laia valikut kotte ja pakendeid, mille saad kohandada oma brändi jaoks.
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
          {filteredProducts.length > 0 ? (
            <>
              <p className="mb-6">Näitan {filteredProducts.length} toodet</p>
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Tooteid ei leitud</h3>
              <p className="text-gray-600 mb-6">Proovige muuta otsingufiltrit või vaadake kõiki tooteid</p>
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
