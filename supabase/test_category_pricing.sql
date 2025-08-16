-- Test script to verify category-specific pricing setup
-- Run this in your Supabase SQL editor to check the current state

-- Check if category tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS ✅'
        ELSE 'MISSING ❌'
    END as status
FROM information_schema.tables 
WHERE table_name IN ('category_quantity_multipliers', 'category_print_prices');

-- Check if global tables have correct data
SELECT 'Global Quantity Multipliers' as table_name, COUNT(*) as record_count FROM quantity_multipliers;
SELECT 'Global Print Prices' as table_name, COUNT(*) as record_count FROM print_prices;

-- Check category-specific data (if tables exist)
SELECT 'Category Quantity Multipliers' as table_name, COUNT(*) as record_count FROM category_quantity_multipliers;
SELECT 'Category Print Prices' as table_name, COUNT(*) as record_count FROM category_print_prices;

-- Show sample global multipliers (should show discounts, not increases)
SELECT 
    quantity_range_start,
    quantity_range_end,
    multiplier,
    CASE 
        WHEN multiplier < 1.0 THEN 'DISCOUNT ✅'
        WHEN multiplier = 1.0 THEN 'NO CHANGE ✅'
        ELSE 'INCREASE ❌'
    END as status
FROM quantity_multipliers 
ORDER BY quantity_range_start;

-- Show sample category multipliers (if they exist)
SELECT 
    product_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    CASE 
        WHEN multiplier < 1.0 THEN 'DISCOUNT ✅'
        WHEN multiplier = 1.0 THEN 'NO CHANGE ✅'
        ELSE 'INCREASE ❌'
    END as status
FROM category_quantity_multipliers 
ORDER BY product_type, quantity_range_start;
