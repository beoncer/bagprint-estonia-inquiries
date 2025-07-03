
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/supabase";
import EnhancedProductGrid from "@/components/product/EnhancedProductGrid";
import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductFilterControls } from "@/components/product/ProductFilterControls";
import { ProductSearch } from "@/components/product/ProductSearch";
import { ProductCategory } from "@/components/product/ProductCategory";
import { ProductSort } from "@/components/product/ProductSort";
import { ProductFilters } from "@/components/product/ProductFilters";
import { DynamicSEO } from "@/components/seo/DynamicSEO";
import Breadcrumb from "@/components/ui/breadcrumb";

const Products = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    isEcoOnly,
    setIsEcoOnly,
    clearFilters,
    hasActiveFilters
  } = useProductFilter(products);

  // Set category from URL params
  React.useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    }
  }, [currentCategory, setSelectedCategory]);

  const categoryDisplayNames: Record<string, string> = {
    'cotton_bag': 'Riidest kotid',
    'paper_bag': 'Paberkotid', 
    'drawstring_bag': 'Nööriga kotid',
    'shoebag': 'Sussikotid',
  };

  const currentCategoryName = selectedCategory ? categoryDisplayNames[selectedCategory] : null;

  return (
    <>
      <DynamicSEO 
        title={currentCategoryName ? `${currentCategoryName} | Leatex` : "Tooted | Leatex"}
        description={currentCategoryName ? `${currentCategoryName} - kvaliteetsed ja keskkonnasõbralikud kotid` : "Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte"}
      />
      
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
        {/* Breadcrumb - positioned consistently */}
        <div className="pt-4 mb-6">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {currentCategoryName || "Tooted"}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentCategoryName 
              ? `Avasta meie ${currentCategoryName.toLowerCase()} kollektsiooni`
              : "Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte"
            }
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="mb-6 space-y-4">
          <ProductSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ProductCategory 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Filters and Sort */}
        <div className="mb-6">
          <ProductFilterControls 
            selectedColors={selectedColors}
            onColorsChange={setSelectedColors}
            selectedSizes={selectedSizes}
            onSizesChange={setSelectedSizes}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isEcoOnly={isEcoOnly}
            onEcoOnlyChange={setIsEcoOnly}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="pb-12">
          <EnhancedProductGrid
            products={filteredProducts}
            loading={isLoading}
            error={error?.message || null}
            emptyStateMessage={
              hasActiveFilters 
                ? "Valitud filtritele vastavaid tooteid ei leitud"
                : "Tooteid ei leitud"
            }
          />
        </div>
      </div>
    </>
  );
};

export default Products;
