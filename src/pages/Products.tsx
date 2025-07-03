
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import DynamicSEO from "@/components/seo/DynamicSEO";
import Breadcrumb from "@/components/ui/breadcrumb";

const Products = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");

  // Product categories configuration
  const productCategories = [
    {
      id: 'cotton_bag',
      name: 'Riidest kotid',
      description: 'Kvaliteetsed ja vastupidavad riidest kotid',
      image: '/placeholder.svg',
      href: '/riidest-kotid'
    },
    {
      id: 'paper_bag',
      name: 'Paberkotid',
      description: 'Keskkonnasõbralikud paberkotid',
      image: '/placeholder.svg',
      href: '/paberkotid'
    },
    {
      id: 'drawstring_bag',
      name: 'Nööriga kotid',
      description: 'Praktilised nööriga kotid',
      image: '/placeholder.svg',
      href: '/nooriga-kotid'
    },
    {
      id: 'shoebag',
      name: 'Sussikotid',
      description: 'Spetsiaalsed sussikotid',
      image: '/placeholder.svg',
      href: '/sussikotid'
    }
  ];

  return (
    <>
      <DynamicSEO />
      
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
        {/* Breadcrumb - positioned consistently */}
        <div className="pt-4 mb-6">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tooted
          </h1>
          <p className="text-gray-600 text-lg">
            Avasta meie laia valikut kvaliteetseid ja keskkonnasõbralikke kotte
          </p>
        </div>

        {/* Product Categories Grid */}
        <div className="pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {productCategories.map((category) => (
              <Link key={category.id} to={category.href}>
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
