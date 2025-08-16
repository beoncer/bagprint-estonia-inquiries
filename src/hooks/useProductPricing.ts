
import { useMemo } from 'react';
import { usePricing } from './usePricing';
import { Product } from '@/types/product';

export function useProductPricing(product: Product) {
  const { calculatePrice, calculateMinimumPrice } = usePricing();

  const pricing = useMemo(() => {
    if (!product) return null;

    const basePrice = product.base_price || 0;
    
    // Calculate minimum possible price using category-specific pricing if available
    const minimumPrice = calculateMinimumPrice(basePrice, product.type);
    
    return {
      basePrice,
      minimumPrice,
      calculatePrice: (quantity: number, colorCount = 0, withPrint = false, size?: string) => {
        return calculatePrice({
          basePrice,
          quantity,
          colorCount,
          withPrint,
          size,
          productType: product.type, // Pass product type for category-specific pricing
          product, // Pass full product object for size multipliers
        });
      },
    };
  }, [product, calculatePrice, calculateMinimumPrice]);

  return pricing;
}
