import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedProductGrid from "@/components/product/EnhancedProductGrid";
import { PRODUCT_COLORS, ProductColor } from "@/lib/constants";
import { BadgeType } from "@/lib/badge-constants";
import Breadcrumb from "@/components/ui/breadcrumb";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  image_url: string;
  base_price: number;
  category: string;
  type: string;
  colors: ProductColor[];
  sizes: string[];
  material: string;
  badges: BadgeType[];
  is_eco: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  color_images?: Record<string, string>;
  size_images?: Record<string, string>;
  additional_images?: string[];
  main_color?: string;
}

const fetchProducts = async (
  category?: string,
  searchTerm?: string,
  colors?: string[],
  sizes?: string[],
  sortBy?: string
): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select("*")
    .eq("visible", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  if (colors && colors.length > 0) {
    query = query.contains("colors", colors);
  }

  if (sizes && sizes.length > 0) {
    query = query.contains("sizes", sizes);
  }

  if (sortBy === "price-asc") {
    query = query.order("base_price", { ascending: true });
  } else if (sortBy === "price-desc") {
    query = query.order("base_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

const Products = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const category = searchParams.get("category") || undefined;

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", category, searchTerm, selectedColors, selectedSizes, sortBy],
    queryFn: () => fetchProducts(category, searchTerm, selectedColors, selectedSizes, sortBy),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const metaTitle = "Leatex tooted";
    const metaDescription = "Tutvu Leatex'i kvaliteetsete toodetega. Meilt leiad kõik vajalikud tooted sinu brändi jaoks.";

    document.title = metaTitle;

    let metaDescriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = "description";
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.content = metaDescription;
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy(undefined);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-20 py-8">
        {/* Add breadcrumb navigation */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">Tooted</h1>
            <form className="w-full md:w-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Otsi tooteid..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </form>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white rounded-lg shadow-sm flex justify-between">
                <TabsTrigger value="all" className="w-full py-2.5 text-sm font-medium rounded-l-lg">
                  Kõik
                </TabsTrigger>
                {/* Add more tabs here if needed */}
              </TabsList>
            </Tabs>

            {/* Filter Button for Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtrid
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filtrid</SheetTitle>
                </SheetHeader>

                {/* Color Filters */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Värvid</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_COLORS.map((color) => (
                      <div key={color.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color.value}`}
                          checked={selectedColors.includes(color.value)}
                          onCheckedChange={() => handleColorChange(color.value)}
                        />
                        <Label htmlFor={`color-${color.value}`}>{color.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Size Filters */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Suurused</h3>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeChange(size)}
                        />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Sort By */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sorteeri</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Vaikimisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Hind (odavamast kallimale)</SelectItem>
                      <SelectItem value="price-desc">Hind (kallimast odavamale)</SelectItem>
                      <SelectItem value="newest">Uuemad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="secondary" className="w-full mt-4" onClick={clearFilters}>
                  Tühista filtrid
                </Button>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Color Filters */}
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold">Värvid:</h3>
                <div className="flex flex-wrap gap-1">
                  {PRODUCT_COLORS.map((color) => (
                    <Badge
                      key={color.value}
                      variant={selectedColors.includes(color.value) ? "default" : "outline"}
                      onClick={() => handleColorChange(color.value)}
                      className="cursor-pointer"
                    >
                      {color.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Size Filters */}
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold">Suurused:</h3>
                <div className="flex flex-wrap gap-1">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <Badge
                      key={size}
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      onClick={() => handleSizeChange(size)}
                      className="cursor-pointer"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sorteeri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Hind (odavamast kallimale)</SelectItem>
                    <SelectItem value="price-desc">Hind (kallimast odavamale)</SelectItem>
                    <SelectItem value="newest">Uuemad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(selectedColors.length > 0 || selectedSizes.length > 0 || sortBy) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Tühista
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">Viga toodete laadimisel.</div>
          ) : (
            <EnhancedProductGrid products={products} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
