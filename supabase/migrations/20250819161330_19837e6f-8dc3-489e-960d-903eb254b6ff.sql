-- Copy cotton bag print pricing to drawstring bags

-- First, remove existing drawstring bag print prices
DELETE FROM category_print_prices WHERE product_type = 'drawstring_bag';

-- Copy all cotton bag print prices to drawstring bags
INSERT INTO category_print_prices (
    product_type,
    quantity_range_start,
    quantity_range_end,
    colors_count,
    price_per_item,
    created_at,
    updated_at
)
SELECT 
    'drawstring_bag' as product_type,
    quantity_range_start,
    quantity_range_end,
    colors_count,
    price_per_item,
    timezone('utc'::text, now()) as created_at,
    timezone('utc'::text, now()) as updated_at
FROM category_print_prices 
WHERE product_type = 'cotton_bag';