
import { usePricing } from './usePricing';
import { Product } from '@/lib/supabase';

export function useProductPricing(product: Product) {
  const { calculatePrice } = usePricing();

  const getStartingPrice = () => {
    return calculatePrice({
      basePrice: product.base_price,
      quantity: 50,
      withPrint: false
    });
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
    getPriceForQuantity
  };
}
