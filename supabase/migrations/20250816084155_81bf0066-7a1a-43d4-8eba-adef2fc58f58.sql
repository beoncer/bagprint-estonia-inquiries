-- Update print prices with A4 values based on new quantity ranges
DELETE FROM print_prices;

-- Insert print prices for 1-99 range (using 50-99 tk values from image)
INSERT INTO print_prices (quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
(1, 99, 1, 1.00),
(1, 99, 2, 1.16),
(1, 99, 3, 1.26),
(1, 99, 4, 1.47),
(1, 99, 5, 1.68),
(1, 99, 6, 1.94),
(1, 99, 7, 2.23),
(1, 99, 8, 2.56),

-- Insert print prices for 100-199 range (using 100-249 tk values from image)
(100, 199, 1, 0.79),
(100, 199, 2, 0.92),
(100, 199, 3, 1.11),
(100, 199, 4, 1.39),
(100, 199, 5, 1.66),
(100, 199, 6, 1.74),
(100, 199, 7, 1.82),
(100, 199, 8, 2.38),

-- Insert print prices for 200-399 range (using 100-249 tk values from image)
(200, 399, 1, 0.79),
(200, 399, 2, 0.92),
(200, 399, 3, 1.11),
(200, 399, 4, 1.39),
(200, 399, 5, 1.66),
(200, 399, 6, 1.74),
(200, 399, 7, 1.82),
(200, 399, 8, 2.38),

-- Insert print prices for 400-699 range (using 250-999 tk values from image)
(400, 699, 1, 0.65),
(400, 699, 2, 0.91),
(400, 699, 3, 1.00),
(400, 699, 4, 1.04),
(400, 699, 5, 1.13),
(400, 699, 6, 1.51),
(400, 699, 7, 1.74),
(400, 699, 8, 2.00),

-- Insert print prices for 700-999 range (using 250-999 tk values from image)
(700, 999, 1, 0.65),
(700, 999, 2, 0.91),
(700, 999, 3, 1.00),
(700, 999, 4, 1.04),
(700, 999, 5, 1.13),
(700, 999, 6, 1.51),
(700, 999, 7, 1.74),
(700, 999, 8, 2.00),

-- Insert print prices for 1000-1499 range (using 1000-2999 tk values from image)
(1000, 1499, 1, 0.54),
(1000, 1499, 2, 0.68),
(1000, 1499, 3, 0.83),
(1000, 1499, 4, 0.88),
(1000, 1499, 5, 1.08),
(1000, 1499, 6, 1.30),
(1000, 1499, 7, 1.50),
(1000, 1499, 8, 1.60),

-- Insert print prices for 1500+ range (using 3000+ tk values from image)
(1500, 9999, 1, 0.45),
(1500, 9999, 2, 0.47),
(1500, 9999, 3, 0.53),
(1500, 9999, 4, 0.69),
(1500, 9999, 5, 0.78),
(1500, 9999, 6, 0.86),
(1500, 9999, 7, 0.98),
(1500, 9999, 8, 1.12);