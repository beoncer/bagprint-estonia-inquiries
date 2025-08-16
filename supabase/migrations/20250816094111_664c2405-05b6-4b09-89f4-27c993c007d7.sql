-- Increase all print prices by 70%
UPDATE print_prices 
SET price_per_item = price_per_item * 1.7,
    updated_at = NOW();