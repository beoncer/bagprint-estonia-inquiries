import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

export function useSizeMultipliers(productId: string) {
  const [sizeMultipliers, setSizeMultipliers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch size multipliers for a specific product
  const fetchSizeMultipliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select('size_multipliers')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setSizeMultipliers(data.size_multipliers || {});
    } catch (err) {
      console.error('Error fetching size multipliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch size multipliers');
    } finally {
      setLoading(false);
    }
  };

  // Update size multipliers for a product
  const updateSizeMultipliers = async (newMultipliers: Record<string, number>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .update({ size_multipliers: newMultipliers })
        .eq('id', productId);

      if (error) throw error;

      setSizeMultipliers(newMultipliers);
    } catch (err) {
      console.error('Error updating size multipliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to update size multipliers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set multiplier for a specific size
  const setSizeMultiplier = async (size: string, multiplier: number) => {
    const newMultipliers = { ...sizeMultipliers, [size]: multiplier };
    await updateSizeMultipliers(newMultipliers);
  };

  // Remove multiplier for a specific size
  const removeSizeMultiplier = async (size: string) => {
    const newMultipliers = { ...sizeMultipliers };
    delete newMultipliers[size];
    await updateSizeMultipliers(newMultipliers);
  };

  // Get multiplier for a specific size
  const getSizeMultiplier = (size: string): number => {
    return sizeMultipliers[size] || 1.0; // Default to 1.0 if no multiplier set
  };

  useEffect(() => {
    if (productId) {
      fetchSizeMultipliers();
    }
  }, [productId]);

  return {
    sizeMultipliers,
    loading,
    error,
    setSizeMultiplier,
    removeSizeMultiplier,
    getSizeMultiplier,
    updateSizeMultipliers,
    refresh: fetchSizeMultipliers
  };
} 