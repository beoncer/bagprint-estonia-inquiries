
export interface QuantityMultiplier {
  id: string;
  quantity_range_start: number;
  quantity_range_end: number;
  multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryQuantityMultiplier extends QuantityMultiplier {
  product_type: string;
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

export interface CategoryPrintPrice extends PrintPrice {
  product_type: string;
}

export interface PriceCalculationInput {
  basePrice: number;
  quantity: number;
  colorCount?: number;
  withPrint?: boolean;
  size?: string;
  productType?: string; // NEW: Product category for category-specific pricing
}

export interface PriceCalculationResult {
  pricePerItem: number;
  totalPrice: number;
  basePrice: number;
  discountedBasePrice: number;
  printCost: number;
  quantityMultiplier: number;
  categoryMultiplier?: number; // NEW: Category-specific multiplier if used
  breakdown: {
    basePrice: number;
    discount: number;
    printCost: number;
    finalPricePerItem: number;
    quantity: number;
    totalPrice: number;
    categoryUsed?: string; // NEW: Which category pricing was used
  };
}

// NEW: Category pricing configuration interface
export interface CategoryPricingConfig {
  productType: string;
  quantityMultipliers: CategoryQuantityMultiplier[];
  printPrices: CategoryPrintPrice[];
  isActive: boolean;
  fallbackToGlobal: boolean; // Whether to fall back to global pricing if no category rule exists
}
