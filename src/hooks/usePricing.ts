
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QuantityMultiplier, PrintPrice, PriceCalculationResult, PriceCalculationInput } from '@/types/pricing';

export function usePricing() {
  const [quantityMultipliers, setQuantityMultipliers] = useState<QuantityMultiplier[]>([]);
  const [printPrices, setPrintPrices] = useState<PrintPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pricing data
  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [multipliersResult, printPricesResult] = await Promise.all([
        supabase.from('quantity_multipliers').select('*').order('quantity_range_start'),
        supabase.from('print_prices').select('*').order('quantity_range_start, colors_count')
      ]);

      if (multipliersResult.error) throw multipliersResult.error;
      if (printPricesResult.error) throw printPricesResult.error;

      setQuantityMultipliers(multipliersResult.data || []);
      setPrintPrices(printPricesResult.data || []);
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

  // Find quantity multiplier for a given quantity
  const getQuantityMultiplier = (quantity: number): number => {
    const multiplier = quantityMultipliers.find(
      m => quantity >= m.quantity_range_start && quantity <= m.quantity_range_end
    );
    return multiplier ? multiplier.multiplier : 1;
  };

  // Find print price for a given quantity and color count
  const getPrintPrice = (quantity: number, colorCount: number): number => {
    const printPrice = printPrices.find(
      p => quantity >= p.quantity_range_start && 
          quantity <= p.quantity_range_end && 
          p.colors_count === colorCount
    );
    return printPrice ? printPrice.price_per_item : 0;
  };

  // Calculate final price based on business logic
  const calculatePrice = ({ basePrice, quantity, colorCount = 0, withPrint = false }: PriceCalculationInput): PriceCalculationResult => {
    // Step 1: Apply quantity discount to base price
    const quantityMultiplier = getQuantityMultiplier(quantity);
    const discountedBasePrice = basePrice * quantityMultiplier;

    // Step 2: Add print cost if printing is requested
    const printCost = withPrint && colorCount > 0 ? getPrintPrice(quantity, colorCount) : 0;

    // Step 3: Calculate final price per item
    const pricePerItem = discountedBasePrice + printCost;
    const totalPrice = pricePerItem * quantity;

    return {
      pricePerItem,
      totalPrice,
      basePrice,
      discountedBasePrice,
      printCost,
      quantityMultiplier,
      breakdown: {
        basePrice,
        discount: basePrice - discountedBasePrice,
        printCost,
        finalPricePerItem: pricePerItem,
        quantity,
        totalPrice
      }
    };
  };

  // Admin functions for updating pricing
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

  const deletePrintPrice = async (id: string) => {
    const { error } = await supabase
      .from('print_prices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPricingData(); // Refresh data
  };

  return {
    quantityMultipliers,
    printPrices,
    loading,
    error,
    calculatePrice,
    getQuantityMultiplier,
    getPrintPrice,
    updateQuantityMultiplier,
    createQuantityMultiplier,
    updatePrintPrice,
    createPrintPrice,
    deletePrintPrice,
    refresh: fetchPricingData
  };
}
