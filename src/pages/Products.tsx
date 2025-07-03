
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/supabase";
import EnhancedProductGrid from "@/components/product/EnhancedProductGrid";
import DynamicSEO from "@/components/seo/DynamicSEO";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

const Products = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const categoryDisplayNames: Record<string, string> = {
    'cotton_bag': 'Riidest kotid',
    'paper_bag': 'Paberkotid', 
    'drawstring_bag': 'Nööriga kotid',
    'shoebag': 'Sussikotid',
  };

  const categories = [
    {
      id: 'cotton_bag',
      name: 'Riidest kotid',
      description: 'Keskkonnasõbralikud riidest kotid igapäevaseks kasutamiseks',
      href: '/riidest-kotid',
      image: '/placeholder.svg'
    },
    {
      id: 'paper_bag',
      name: 'Paberkotid',
      description: 'Kvaliteetsed paberkotid erinevate sündmuste jaoks',
      href: '/paberkotid',
      image: '/placeholder.svg'
    },
    {
      id: 'drawstring_bag',
      name: 'Nööriga kotid',
      description: 'Praktilised nööriga kotid spordiks ja reisimiseks',
      href: '/nooriga-kotid',
      image: '/placeholder.svg'
    },
    {
      id: 'shoebag',
      name: 'Sussikotid',
      description: 'Mugavad sussikotid jalanõude hoiustamiseks',
      href: '/sussikotid',
      image: '/placeholder.svg'
    }
  ];

  const currentCategoryName = currentCategory ? categoryDisplayNames[currentCategory] : null;

  // If a category is selected, show products for that category
  if (currentCategory) {
    const filteredProducts = products.filter(product => product.type === currentCategory);
    
    return (
      <>
        <DynamicSEO 
          title={currentCategoryName ? `${currentCategoryName} | Leatex` : "Tooted | Leatex"}
          description={currentCategoryName ? `${currentCategoryName} - kvaliteetsed ja keskkonnasõbralikud kotid` : "Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte"}
        />
        
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="pt-4 mb-6">
            <Breadcrumb />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {currentCategoryName}
            </h1>
            <p className="text-gray-600 text-lg">
              Avasta meie {currentCategoryName?.toLowerCase()} kollektsiooni
            </p>
          </div>

          <div className="pb-12">
            <EnhancedProductGrid
              products={filteredProducts}
              loading={isLoading}
              error={error?.message || null}
              emptyStateMessage="Valitud kategoorias tooteid ei leitud"
            />
          </div>
        </div>
      </>
    );
  }

  // Default view - show product categories
  return (
    <>
      <DynamicSEO 
        title="Tooted | Leatex"
        description="Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte"
      />
      
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
        <div className="pt-4 mb-6">
          <Breadcrumb />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tooted
          </h1>
          <p className="text-gray-600 text-lg">
            Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {categories.map((category) => (
            <Link key={category.id} to={category.href}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square w-full relative overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
