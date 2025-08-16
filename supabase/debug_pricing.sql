-- 🚨 COMPREHENSIVE PRICING DEBUG SCRIPT
-- Run this in your Supabase SQL Editor to diagnose pricing issues

-- ========================================
-- 1. CHECK IF TABLES EXIST
-- ========================================
SELECT '=== TABLE EXISTENCE CHECK ===' as section;

SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS ✅'
        ELSE 'MISSING ❌'
    END as status
FROM information_schema.tables 
WHERE table_name IN (
    'quantity_multipliers', 
    'print_prices', 
    'category_quantity_multipliers', 
    'category_print_prices'
);

-- ========================================
-- 2. CHECK GLOBAL PRICING DATA
-- ========================================
SELECT '=== GLOBAL PRICING DATA ===' as section;

SELECT 'Global Quantity Multipliers' as table_name, COUNT(*) as record_count FROM quantity_multipliers;
SELECT 'Global Print Prices' as table_name, COUNT(*) as record_count FROM print_prices;

-- Show global multipliers with status
SELECT 
    quantity_range_start,
    quantity_range_end,
    multiplier,
    CASE 
        WHEN multiplier < 1.0 THEN 'DISCOUNT ✅'
        WHEN multiplier = 1.0 THEN 'NO CHANGE ✅'
        ELSE 'INCREASE ❌'
    END as status,
    'Global' as source
FROM quantity_multipliers 
ORDER BY quantity_range_start;

-- ========================================
-- 3. CHECK CATEGORY-SPECIFIC DATA
-- ========================================
SELECT '=== CATEGORY-SPECIFIC DATA ===' as section;

-- Check if category tables exist and have data
SELECT 'Category Quantity Multipliers' as table_name, COUNT(*) as record_count FROM category_quantity_multipliers;
SELECT 'Category Print Prices' as table_name, COUNT(*) as record_count FROM category_print_prices;

-- Show category multipliers with status
SELECT 
    product_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    CASE 
        WHEN multiplier < 1.0 THEN 'DISCOUNT ✅'
        WHEN multiplier = 1.0 THEN 'NO CHANGE ✅'
        ELSE 'INCREASE ❌'
    END as status,
    'Category' as source
FROM category_quantity_multipliers 
ORDER BY product_type, quantity_range_start;

-- ========================================
-- 4. CHECK PRODUCT TYPES
-- ========================================
SELECT '=== PRODUCT TYPES CHECK ===' as section;

-- Check what product types exist in products table
SELECT DISTINCT type as product_type, COUNT(*) as product_count 
FROM products 
GROUP BY type 
ORDER BY type;

-- ========================================
-- 5. TEST PRICING LOGIC
-- ========================================
SELECT '=== PRICING LOGIC TEST ===' as section;

-- Test case: Cotton bag, quantity 1
SELECT 'Test Case: Cotton Bag, Qty 1' as test_description;

-- Check global rule for quantity 1
SELECT 
    'Global Rule' as rule_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    'Applies to quantity 1' as note
FROM quantity_multipliers 
WHERE 1 >= quantity_range_start AND 1 <= quantity_range_end;

-- Check category rule for cotton_bag, quantity 1
SELECT 
    'Category Rule' as rule_type,
    product_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    'Applies to cotton_bag, quantity 1' as note
FROM category_quantity_multipliers 
WHERE product_type = 'cotton_bag' 
  AND 1 >= quantity_range_start 
  AND 1 <= quantity_range_end;

-- ========================================
-- 6. COMPARE GLOBAL VS CATEGORY
-- ========================================
SELECT '=== GLOBAL VS CATEGORY COMPARISON ===' as section;

-- Show side-by-side comparison for cotton_bag
SELECT 
    g.quantity_range_start,
    g.quantity_range_end,
    g.multiplier as global_multiplier,
    c.multiplier as category_multiplier,
    CASE 
        WHEN c.multiplier IS NOT NULL THEN 'Category Override ✅'
        ELSE 'Global Only'
    END as pricing_source,
    CASE 
        WHEN c.multiplier IS NOT NULL AND c.multiplier != g.multiplier THEN 'DIFFERENT'
        WHEN c.multiplier IS NOT NULL AND c.multiplier = g.multiplier THEN 'SAME'
        ELSE 'N/A'
    END as comparison
FROM quantity_multipliers g
LEFT JOIN category_quantity_multipliers c ON 
    c.product_type = 'cotton_bag' AND
    c.quantity_range_start = g.quantity_range_start AND
    c.quantity_range_end = g.quantity_range_end
ORDER BY g.quantity_range_start;

-- ========================================
-- 7. RECOMMENDATIONS
-- ========================================
SELECT '=== RECOMMENDATIONS ===' as section;

-- Check if global pricing needs fixing
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM quantity_multipliers 
            WHERE multiplier > 1.0
        ) THEN '🚨 FIX NEEDED: Global multipliers are INCREASING prices!'
        ELSE '✅ Global pricing looks correct'
    END as global_status;

-- Check if category tables need to be created
SELECT 
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'category_quantity_multipliers'
        ) THEN '🚨 ACTION NEEDED: Run category pricing migration!'
        ELSE '✅ Category tables exist'
    END as category_status;

-- Check if category data exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM category_quantity_multipliers 
            WHERE product_type = 'cotton_bag'
        ) THEN '✅ Category data exists for cotton_bag'
        ELSE '⚠️ No category data for cotton_bag - create some rules!'
    END as cotton_bag_status;
