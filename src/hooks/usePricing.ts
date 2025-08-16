
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  QuantityMultiplier, 
  PrintPrice, 
  PriceCalculationResult, 
  PriceCalculationInput,
  CategoryQuantityMultiplier,
  CategoryPrintPrice,
  CategoryPricingConfig
} from '@/types/pricing';

export function usePricing() {
  const [quantityMultipliers, setQuantityMultipliers] = useState<QuantityMultiplier[]>([]);
  const [printPrices, setPrintPrices] = useState<PrintPrice[]>([]);
  const [categoryQuantityMultipliers, setCategoryQuantityMultipliers] = useState<CategoryQuantityMultiplier[]>([]);
  const [categoryPrintPrices, setCategoryPrintPrices] = useState<CategoryPrintPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pricing data
  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching pricing data...');

      const [multipliersResult, printPricesResult, categoryMultipliersResult, categoryPrintPricesResult] = await Promise.all([
        supabase.from('quantity_multipliers').select('*').order('quantity_range_start'),
        supabase.from('print_prices').select('*').order('quantity_range_start, colors_count'),
        supabase.from('category_quantity_multipliers').select('*').order('product_type, quantity_range_start'),
        supabase.from('category_print_prices').select('*').order('product_type, quantity_range_start, colors_count')
      ]);

      if (multipliersResult.error) throw multipliersResult.error;
      if (printPricesResult.error) throw printPricesResult.error;
      if (categoryMultipliersResult.error) throw categoryMultipliersResult.error;
      if (categoryPrintPricesResult.error) throw categoryPrintPricesResult.error;

      console.log('📊 Pricing data fetched:', {
        globalMultipliers: multipliersResult.data?.length || 0,
        globalPrintPrices: printPricesResult.data?.length || 0,
        categoryMultipliers: categoryMultipliersResult.data?.length || 0,
        categoryPrintPrices: categoryPrintPricesResult.data?.length || 0
      });

      console.log('🎯 Category multipliers found:', categoryMultipliersResult.data);

      setQuantityMultipliers(multipliersResult.data || []);
      setPrintPrices(printPricesResult.data || []);
      setCategoryQuantityMultipliers(categoryMultipliersResult.data || []);
      setCategoryPrintPrices(categoryPrintPricesResult.data || []);
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  // Find quantity multiplier for a given quantity and product type
  const getQuantityMultiplier = (quantity: number, productType?: string): number => {
    console.log(`🔍 getQuantityMultiplier called:`, {
      quantity,
      productType,
      categoryMultipliersCount: categoryQuantityMultipliers.length,
      globalMultipliersCount: quantityMultipliers.length
    });

    // First try to find category-specific multiplier
    if (productType) {
      console.log(`🔍 Looking for category rules for ${productType}:`, 
        categoryQuantityMultipliers.filter(m => m.product_type === productType)
      );

      const categoryMultiplier = categoryQuantityMultipliers.find(
        m => m.product_type === productType && 
             quantity >= m.quantity_range_start && 
             quantity <= m.quantity_range_end
      );
      
      if (categoryMultiplier) {
        console.log(`🎯 Category pricing found for ${productType}:`, {
          quantity,
          range: `${categoryMultiplier.quantity_range_start}-${categoryMultiplier.quantity_range_end}`,
          multiplier: categoryMultiplier.multiplier,
          categoryMultipliers: categoryQuantityMultipliers.filter(m => m.product_type === productType)
        });
        return categoryMultiplier.multiplier;
      } else {
        console.log(`❌ No category rule found for ${productType} at quantity ${quantity}`);
      }
    }

    // Fall back to global multiplier
    const globalMultiplier = quantityMultipliers.find(
      m => quantity >= m.quantity_range_start && quantity <= m.quantity_range_end
    );
    
    console.log(`🌍 Global pricing used:`, {
      quantity,
      productType,
      globalMultiplier: globalMultiplier?.multiplier || 1,
      categoryMultipliers: categoryQuantityMultipliers.filter(m => m.product_type === productType),
      allGlobalMultipliers: quantityMultipliers
    });
    
    return globalMultiplier ? globalMultiplier.multiplier : 1;
  };

  // Find print price for a given quantity, color count, and product type
  const getPrintPrice = (quantity: number, colorCount: number, productType?: string): number => {
    let perItemPrice = 0;
    
    // First try to find category-specific print price
    if (productType) {
      const categoryPrintPrice = categoryPrintPrices.find(
        p => p.product_type === productType &&
             quantity >= p.quantity_range_start &&
             quantity <= p.quantity_range_end &&
             p.colors_count === colorCount
      );
      if (categoryPrintPrice) {
        perItemPrice = categoryPrintPrice.price_per_item;
      }
    }

    // Fall back to global print price if no category-specific price found
    if (perItemPrice === 0) {
      const globalPrintPrice = printPrices.find(
        p => quantity >= p.quantity_range_start &&
             quantity <= p.quantity_range_end &&
             p.colors_count === colorCount
      );
      perItemPrice = globalPrintPrice ? globalPrintPrice.price_per_item : 0;
    }

    // Add €21 setup cost per color
    const setupCostPerColor = 21;
    const totalSetupCost = setupCostPerColor * colorCount;
    
    // Calculate total print cost: (per-item price × quantity) + setup cost
    const totalPrintCost = (perItemPrice * quantity) + totalSetupCost;
    
    console.log('🖨️ Print cost calculation:', {
      productType,
      quantity,
      colorCount,
      perItemPrice,
      setupCostPerColor,
      totalSetupCost,
      perItemTotal: perItemPrice * quantity,
      totalPrintCost
    });
    
    // Return the total cost (this will be used to calculate price per item)
    return totalPrintCost;
  };

  // Calculate minimum possible price for a product category
  const calculateMinimumPrice = (basePrice: number, productType?: string): number => {
    const multipliers = productType 
      ? categoryQuantityMultipliers.filter(m => m.product_type === productType)
      : quantityMultipliers;
    
    if (multipliers.length === 0) return basePrice;
    
    const highestTier = multipliers.reduce((highest, current) => 
      current.multiplier < highest.multiplier ? current : highest
    );
    
    return basePrice * highestTier.multiplier;
  };

  // Calculate final price based on business logic
  const calculatePrice = ({ basePrice, quantity, colorCount = 0, withPrint = false, size, productType, product }: PriceCalculationInput & { product?: any }): PriceCalculationResult => {
    // Step 1: Apply quantity discount to base price (with category-specific logic)
    const quantityMultiplier = getQuantityMultiplier(quantity, productType);
    const discountedBasePrice = basePrice * quantityMultiplier;

    // Step 2: Apply size multiplier if size is specified and product has size multipliers
    let sizeMultiplier = 1.0;
    if (size && product?.size_multipliers) {
      sizeMultiplier = product.size_multipliers[size] || 1.0;
    }
    const sizeAdjustedPrice = discountedBasePrice * sizeMultiplier;

    // Step 3: Add print cost if printing is requested (with category-specific logic)
    const printCost = withPrint && colorCount > 0 ? getPrintPrice(quantity, colorCount, productType) : 0;

    // Step 4: Calculate final price per item
    // Note: printCost is now the total cost for all items, so we divide by quantity to get per-item cost
    const printCostPerItem = withPrint && colorCount > 0 ? printCost / quantity : 0;
    const pricePerItem = sizeAdjustedPrice + printCostPerItem;
    const totalPrice = pricePerItem * quantity;

    // Step 5: Calculate discount based on highest category price (not base price)
    let discount = 0;
    if (productType) {
      // Find the highest category multiplier for this product type
      const categoryMultipliers = categoryQuantityMultipliers.filter(m => m.product_type === productType);
      if (categoryMultipliers.length > 0) {
        const highestMultiplier = Math.max(...categoryMultipliers.map(m => m.multiplier));
        const highestPossiblePrice = basePrice * highestMultiplier;
        const currentPrice = basePrice * quantityMultiplier;
        
        console.log('💰 Discount calculation:', {
          productType,
          basePrice,
          currentMultiplier: quantityMultiplier,
          highestMultiplier,
          currentPrice,
          highestPossiblePrice,
          discountAmount: highestPossiblePrice - currentPrice
        });
        
        // Only show discount if current price is lower than highest price
        if (currentPrice < highestPossiblePrice) {
          discount = highestPossiblePrice - currentPrice;
          console.log('🎯 Discount applied:', discount);
        } else {
          console.log('❌ No discount - current price is not lower than highest price');
        }
      }
    } else {
      // For global pricing, use the old logic
      discount = basePrice - discountedBasePrice;
      console.log('🌍 Global pricing discount:', discount);
    }

    // Determine if category-specific pricing was used
    const categoryUsed = productType && (
      categoryQuantityMultipliers.some(m => m.product_type === productType) ||
      categoryPrintPrices.some(p => p.product_type === productType)
    ) ? productType : undefined;

    return {
      pricePerItem,
      totalPrice,
      basePrice,
      discountedBasePrice,
      printCost,
      quantityMultiplier,
      categoryMultiplier: productType ? quantityMultiplier : undefined,
      breakdown: {
        basePrice,
        discount,
        printCost,
        finalPricePerItem: pricePerItem,
        quantity,
        totalPrice,
        categoryUsed
      }
    };
  };

  // Admin functions for updating global pricing
  const updateQuantityMultiplier = async (data: Partial<QuantityMultiplier> & { id: string }) => {
    const { error } = await supabase
      .from('quantity_multipliers')
      .update(data)
      .eq('id', data.id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const createQuantityMultiplier = async (data: Omit<QuantityMultiplier, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('quantity_multipliers')
      .insert(data);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const updatePrintPrice = async (data: Partial<PrintPrice> & { id: string }) => {
    const { error } = await supabase
      .from('print_prices')
      .update(data)
      .eq('id', data.id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const createPrintPrice = async (data: Omit<PrintPrice, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('print_prices')
      .insert(data);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  // NEW: Admin functions for category-specific pricing
  const updateCategoryQuantityMultiplier = async (data: Partial<CategoryQuantityMultiplier> & { id: string }) => {
    const { error } = await supabase
      .from('category_quantity_multipliers')
      .update(data)
      .eq('id', data.id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const createCategoryQuantityMultiplier = async (data: Omit<CategoryQuantityMultiplier, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('category_quantity_multipliers')
      .insert(data);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const deleteCategoryQuantityMultiplier = async (id: string) => {
    const { error } = await supabase
      .from('category_quantity_multipliers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const updateCategoryPrintPrice = async (data: Partial<CategoryPrintPrice> & { id: string }) => {
    const { error } = await supabase
      .from('category_print_prices')
      .update(data)
      .eq('id', data.id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const createCategoryPrintPrice = async (data: Omit<CategoryPrintPrice, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('category_print_prices')
      .insert(data);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  const deleteCategoryPrintPrice = async (id: string) => {
    const { error } = await supabase
      .from('category_print_prices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  // Get category-specific pricing configuration
  const getCategoryPricingConfig = (productType: string): CategoryPricingConfig => {
    const categoryMultipliers = categoryQuantityMultipliers.filter(m => m.product_type === productType);
    const categoryPrintPricesFiltered = categoryPrintPrices.filter(p => p.product_type === productType);
    
    return {
      productType,
      quantityMultipliers: categoryMultipliers,
      printPrices: categoryPrintPricesFiltered,
      isActive: categoryMultipliers.length > 0 || categoryPrintPricesFiltered.length > 0,
      fallbackToGlobal: true // Always fall back to global pricing
    };
  };

  // Get all available product types for category pricing
  const getAvailableProductTypes = (): string[] => {
    const types = new Set(categoryQuantityMultipliers.map(m => m.product_type));
    categoryPrintPrices.forEach(p => types.add(p.product_type));
    return Array.from(types).sort();
  };

  return {
    // Global pricing data
    quantityMultipliers,
    printPrices,
    
    // Category-specific pricing data
    categoryQuantityMultipliers,
    categoryPrintPrices,
    
    // State
    loading,
    error,
    
    // Global pricing functions
    getQuantityMultiplier,
    getPrintPrice,
    calculateMinimumPrice,
    calculatePrice,
    updateQuantityMultiplier,
    createQuantityMultiplier,
    updatePrintPrice,
    createPrintPrice,
    
    // Category-specific pricing functions
    updateCategoryQuantityMultiplier,
    createCategoryQuantityMultiplier,
    deleteCategoryQuantityMultiplier,
    updateCategoryPrintPrice,
    createCategoryPrintPrice,
    deleteCategoryPrintPrice,
    getCategoryPricingConfig,
    getAvailableProductTypes,
    
    // Utility
    fetchPricingData,
  };
}
