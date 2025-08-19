-- Copy cotton bag pricing rules to shoe bags

-- First, remove existing shoe bag pricing rules
DELETE FROM category_quantity_multipliers WHERE product_type = 'shoebag';
DELETE FROM category_print_prices WHERE product_type = 'shoebag';

-- Copy all cotton bag quantity multipliers to shoe bags
INSERT INTO category_quantity_multipliers (
    product_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    created_at,
    updated_at
)
SELECT 
    'shoebag' as product_type,
    quantity_range_start,
    quantity_range_end,
    multiplier,
    timezone('utc'::text, now()) as created_at,
    timezone('utc'::text, now()) as updated_at
FROM category_quantity_multipliers 
WHERE product_type = 'cotton_bag';

-- Copy all cotton bag print prices to shoe bags
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
    'shoebag' as product_type,
    quantity_range_start,
    quantity_range_end,
    colors_count,
    price_per_item,
    timezone('utc'::text, now()) as created_at,
    timezone('utc'::text, now()) as updated_at
FROM category_print_prices 
WHERE product_type = 'cotton_bag';