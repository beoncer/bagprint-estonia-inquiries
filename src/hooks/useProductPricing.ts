
import { usePricing } from './usePricing';
import { Product } from '@/lib/supabase';

export function useProductPricing(product: Product) {
  const { calculatePrice, calculateMinimumPrice } = usePricing();

  const getStartingPrice = () => {
    return calculatePrice({
      basePrice: product.base_price,
      quantity: 50,
      withPrint: false
    });
  };

  const getMinimumPrice = () => {
    return calculateMinimumPrice(product.base_price);
  };

  const getPriceForQuantity = (quantity: number, withPrint: boolean = false, colorCount: number = 1) => {
    return calculatePrice({
      basePrice: product.base_price,
      quantity,
      colorCount: withPrint ? colorCount : 0,
      withPrint
    });
  };

  return {
    getStartingPrice,
    getMinimumPrice,
    getPriceForQuantity
  };
}
