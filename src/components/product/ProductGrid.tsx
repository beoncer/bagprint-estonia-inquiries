
import ProductCard, { ProductProps } from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ProductGridProps {
  category?: string;
}

const ProductGrid = ({ category }: ProductGridProps) => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      console.log('Fetching products for category:', category);
      
      let query = supabase
        .from('products')
        .select('*');
      
      if (category && category !== 'all') {
        query = query.eq('type', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Fetched products:', data);
      
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image_url,
        category: item.type,
        startingPrice: extractStartingPrice(item.pricing_without_print),
        slug: item.slug,
      })) as ProductProps[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse aspect-square rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Viga toodete laadimisel: {error.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Tooteid ei leitud.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

function extractStartingPrice(pricing: any): number | undefined {
  if (!pricing) return undefined;
  try {
    const parsed = typeof pricing === "string" ? JSON.parse(pricing) : pricing;
    const prices = Object.values(parsed).map(Number).filter(n => !isNaN(n));
    return prices.length ? Math.min(...prices) : undefined;
  } catch {
    return undefined;
  }
}

export default ProductGrid;
