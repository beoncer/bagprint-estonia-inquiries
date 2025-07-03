import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ProductBadge } from "@/components/product/ProductBadge";
import { Product } from "@/types/product";
import { BadgeType } from "@/lib/badge-constants";
import Breadcrumb from "@/components/ui/breadcrumb";

interface ProductFilter {
  id: string;
  name: string;
  slug: string;
}

interface ProductWithCategory extends Product {
  category_name?: string;
}

const fetchProducts = async (category?: string): Promise<ProductWithCategory[]> => {
  let query = supabase
    .from('products')
    .select('*, product_categories(name)')
    .eq('visible', true)
    .order('order', { ascending: true });

  if (category) {
    query = query.eq('type', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error fetching products:", error);
    throw new Error(error.message);
  }

  return data || [];
};

const fetchProductFilters = async (): Promise<ProductFilter[]> => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .eq('visible', true)
    .order('order', { ascending: true });

  if (error) {
    console.error("Supabase error fetching product filters:", error);
    return [];
  }

  return data || [];
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', activeFilter],
    queryFn: () => fetchProducts(activeFilter!),
    staleTime: 1000 * 60 * 5,
  });

  const { data: productFilters, isLoading: filtersLoading, error: filtersError } = useQuery({
    queryKey: ['productFilters'],
    queryFn: fetchProductFilters,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products || []);
    } else {
      const filtered = (products || []).filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterClick = (filter: string | null) => {
    setActiveFilter(filter);
  };

  const getCategoryName = (product: ProductWithCategory): string => {
    return product.product_categories?.name || 'Unknown Category';
  };

  const getProductsTitle = (): string => {
    if (activeFilter) {
      const filter = productFilters?.find(f => f.slug === activeFilter);
      return filter ? filter.name : 'Tooted';
    }
    return 'Tooted';
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">{getProductsTitle()}</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:max-w-sm">
            <Input
              type="text"
              placeholder="Otsi tooteid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </form>

          {/* Product Filters */}
          {productFilters && productFilters.length > 0 && (
            <div className="mt-4 md:mt-0">
              <div className="inline-flex space-x-2">
                <Button
                  variant={activeFilter === null ? "default" : "outline"}
                  onClick={() => handleFilterClick(null)}
                >
                  Kõik
                </Button>
                {productFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.slug ? "default" : "outline"}
                    onClick={() => handleFilterClick(filter.slug)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-16">Laadimine...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">Viga toodete laadimisel.</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/tooted/${product.slug}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={product.image_url || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {product.badges && product.badges.map((badge) => (
                        <ProductBadge key={badge} type={badge as BadgeType} />
                      ))}
                      {product.is_eco && (
                        <Badge variant="outline">
                          Eco
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">Toodet ei leitud</h3>
            <p className="text-gray-600">Proovige muuta otsinguterminit või valige mõni muu filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
