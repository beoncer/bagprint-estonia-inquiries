
import React from 'react';
import { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';

interface EnhancedProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  emptyStateMessage?: string;
  skeletonCount?: number;
}

const EnhancedProductGrid: React.FC<EnhancedProductGridProps> = ({
  products,
  loading = false,
  error = null,
  emptyStateMessage = "Tooteid ei leitud",
  skeletonCount = 6 // Reduced from 8
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Viga</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{emptyStateMessage}</h3>
          <p className="text-gray-600 text-sm">Proovige muuta otsingufiltrit või sirvige kõiki tooteid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description || ''}
          image={product.image || product.image_url || ''}
          category={product.category}
          base_price={product.base_price}
          slug={product.slug || ''}
          color_images={product.color_images}
          main_color={product.main_color}
          image_url={product.image_url}
          type={product.type}
        />
      ))}
    </div>
  );
};

export default EnhancedProductGrid;
