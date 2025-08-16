-- Migration: Fix global quantity multipliers
-- Date: 2025-01-28
-- Description: Fixes incorrect global quantity multipliers that were increasing prices instead of decreasing them

-- Delete the incorrect multipliers that increase prices
DELETE FROM quantity_multipliers;

-- Insert correct multipliers that provide bulk discounts
INSERT INTO quantity_multipliers (quantity_range_start, quantity_range_end, multiplier) VALUES
(1, 99, 1.00),      -- No discount for small orders (1-99)
(100, 199, 0.90),   -- 10% discount for 100-199
(200, 399, 0.80),   -- 20% discount for 200-399
(400, 699, 0.75),   -- 25% discount for 400-699
(700, 999, 0.70),   -- 30% discount for 700-999
(1000, 1499, 0.65), -- 35% discount for 1000-1499
(1500, 9999, 0.60)  -- 40% discount for 1500+
ON CONFLICT (quantity_range_start, quantity_range_end) DO NOTHING;

-- Add comment explaining the fix
COMMENT ON TABLE quantity_multipliers IS 'Global quantity multipliers providing bulk discounts. Lower multipliers = better prices for larger quantities.';
