-- Increase paper bag print prices by 1.5x
UPDATE category_print_prices 
SET 
    price_per_item = ROUND(price_per_item * 1.5, 2),
    updated_at = timezone('utc'::text, now())
WHERE product_type = 'paper_bag';