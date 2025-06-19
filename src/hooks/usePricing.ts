import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PrintPrice, QuantityMultiplier, QUANTITY_RANGES, PRINT_PRICES } from '@/types/pricing';

interface PriceResult {
  basePrice: number;
  printPrice: number;
  totalPrice: number;
  pricePerItem: number;
}

export function usePricing() {
  const [printPrices, setPrintPrices] = useState<PrintPrice[]>([]);
  const [quantityMultipliers, setQuantityMultipliers] = useState<QuantityMultiplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pricing data
  const fetchPricingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch print prices
      const { data: printPricesData, error: printPricesError } = await supabase
        .from('print_prices')
        .select('*')
        .order('quantity_range_start', { ascending: true })
        .order('colors_count', { ascending: true });

      if (printPricesError) throw printPricesError;

      // Fetch quantity multipliers
      const { data: multipliersData, error: multipliersError } = await supabase
        .from('quantity_multipliers')
        .select('*')
        .order('quantity_range_start', { ascending: true });

      if (multipliersError) throw multipliersError;

      setPrintPrices(printPricesData);
      setQuantityMultipliers(multipliersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching pricing data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update print price
  const updatePrintPrice = async (price: Partial<PrintPrice> & { id: string }) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('print_prices')
        .update(price)
        .eq('id', price.id);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating print price');
      throw err;
    }
  };

  // Update quantity multiplier
  const updateQuantityMultiplier = async (multiplier: Partial<QuantityMultiplier> & { id: string }) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('quantity_multipliers')
        .update(multiplier)
        .eq('id', multiplier.id);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating quantity multiplier');
      throw err;
    }
  };

  // Create print price
  const createPrintPrice = async (price: Omit<PrintPrice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('print_prices')
        .insert(price);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating print price');
      throw err;
    }
  };

  // Create quantity multiplier
  const createQuantityMultiplier = async (multiplier: Omit<QuantityMultiplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('quantity_multipliers')
        .insert(multiplier);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating quantity multiplier');
      throw err;
    }
  };

  // Delete print price
  const deletePrintPrice = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('print_prices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting print price');
      throw err;
    }
  };

  // Delete quantity multiplier
  const deleteQuantityMultiplier = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('quantity_multipliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPricingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting quantity multiplier');
      throw err;
    }
  };

  // Calculate final price
  const calculatePrice = (
    basePrice: number,
    quantity: number,
    colorCount?: number
  ): PriceResult => {
    // Find the appropriate quantity range and multiplier
    const range = QUANTITY_RANGES.find(
      (r) => quantity >= r.start && (r.end === null || quantity <= r.end)
    );

    if (!range) {
      throw new Error(`No quantity range found for quantity: ${quantity}`);
    }

    // Calculate base price with quantity multiplier
    const basePriceWithMultiplier = basePrice * range.multiplier;

    // Calculate print price if applicable
    let printPrice = 0;
    if (colorCount) {
      const printPriceConfig = PRINT_PRICES.find(
        (p) => p.colorCount === colorCount
      );
      if (!printPriceConfig) {
        throw new Error(`No print price found for color count: ${colorCount}`);
      }
      printPrice = printPriceConfig.price * quantity;
    }

    // Calculate total price
    const totalPrice = (basePriceWithMultiplier * quantity) + printPrice;
    const pricePerItem = totalPrice / quantity;

    return {
      basePrice: basePriceWithMultiplier * quantity,
      printPrice,
      totalPrice,
      pricePerItem,
    };
  };

  useEffect(() => {
    fetchPricingData();
  }, [fetchPricingData]);

  return {
    printPrices,
    quantityMultipliers,
    loading,
    error,
    updatePrintPrice,
    updateQuantityMultiplier,
    createPrintPrice,
    createQuantityMultiplier,
    deletePrintPrice,
    deleteQuantityMultiplier,
    calculatePrice,
    refetch: fetchPricingData
  };
} 