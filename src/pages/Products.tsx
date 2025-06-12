
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { getProducts, getProductCategories, Product, ProductCategory } from "@/lib/supabase";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getProductCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSearchParams({});
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-10">
          <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-96 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary">Meie</span>{" "}
              <span className="text-black">tooted</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl">
              Avastage meie lai valik kvaliteetseid kotte ja pakendeid. Kõik tooted on saadaval kohandatud trükiga, 
              et rõhutada teie brändi identiteeti ja jätta klientidele unustamatu mulje.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Otsi tooteid..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </form>
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Vali kategooria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Kõik kategooriad</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(searchTerm || (selectedCategory && selectedCategory !== "all")) && (
              <Button variant="outline" onClick={clearFilters}>
                Kustuta filtrid
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          {filteredProducts.length > 0 ? (
            <>
              <p className="mb-8 text-gray-600">
                Leitud {filteredProducts.length} toodet
                {searchTerm && ` otsingule "${searchTerm}"`}
                {selectedCategory && selectedCategory !== "all" && 
                  ` kategoorias "${categories.find(c => c.id === selectedCategory)?.name}"`
                }
              </p>
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Tooteid ei leitud</h3>
              <p className="text-gray-600 mb-6">
                Proovige muuta otsingukriteeriumeid või kategooriat
              </p>
              <Button onClick={clearFilters}>
                Näita kõiki tooteid
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ei leidnud sobivat toodet?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Võtke meiega ühendust ja leiame just teile sobiva lahenduse.
          </p>
          <Button variant="secondary" size="lg">
            Küsi pakkumist
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
