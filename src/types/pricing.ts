
export interface QuantityMultiplier {
  id: string;
  quantity_range_start: number;
  quantity_range_end: number;
  multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface PrintPrice {
  id: string;
  quantity_range_start: number;
  quantity_range_end: number;
  colors_count: number;
  price_per_item: number;
  created_at: string;
  updated_at: string;
}

export interface PriceCalculationResult {
  pricePerItem: number;
  totalPrice: number;
  basePrice: number;
  discountedBasePrice: number;
  printCost: number;
  quantityMultiplier: number;
  breakdown: {
    basePrice: number;
    discount: number;
    printCost: number;
    finalPricePerItem: number;
    quantity: number;
    totalPrice: number;
  };
}

export interface PriceCalculationInput {
  basePrice: number;
  quantity: number;
  colorCount?: number;
  withPrint?: boolean;
  size?: string; // Selected size for size-based pricing
  product?: any; // Product object to access size_multipliers
}
