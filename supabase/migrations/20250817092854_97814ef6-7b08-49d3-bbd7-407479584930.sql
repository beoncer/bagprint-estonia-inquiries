-- Clear existing paper bag category print prices
DELETE FROM category_print_prices WHERE product_type = 'paper_bag';

-- Insert new paper bag category print prices (multiplied by 2.2)
-- Based on image: 50-99 → 1-99, 100-199 → 100-199, 200-499 → 200-399, 500-1499 → 400-699/700-999/1000-1499, 1500+ → 1500-9999

-- Quantity range 1-99 (from image 50-99: €0.29, €0.59, €0.88, €1.17 * 2.2)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 1, 99, 1, 0.64),    -- €0.29 * 2.2
('paper_bag', 1, 99, 2, 1.30),    -- €0.59 * 2.2
('paper_bag', 1, 99, 3, 1.94),    -- €0.88 * 2.2
('paper_bag', 1, 99, 4, 2.57),    -- €1.17 * 2.2
('paper_bag', 1, 99, 5, 2.57),    -- Same as 4 colors
('paper_bag', 1, 99, 6, 2.57),    -- Same as 4 colors
('paper_bag', 1, 99, 7, 2.57),    -- Same as 4 colors
('paper_bag', 1, 99, 8, 2.57);    -- Same as 4 colors

-- Quantity range 100-199 (from image 100-199: €0.17, €0.34, €0.51, €0.68 * 2.2)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 100, 199, 1, 0.37), -- €0.17 * 2.2
('paper_bag', 100, 199, 2, 0.75), -- €0.34 * 2.2
('paper_bag', 100, 199, 3, 1.12), -- €0.51 * 2.2
('paper_bag', 100, 199, 4, 1.50), -- €0.68 * 2.2
('paper_bag', 100, 199, 5, 1.50), -- Same as 4 colors
('paper_bag', 100, 199, 6, 1.50), -- Same as 4 colors
('paper_bag', 100, 199, 7, 1.50), -- Same as 4 colors
('paper_bag', 100, 199, 8, 1.50); -- Same as 4 colors

-- Quantity range 200-399 (from image 200-499: €0.19, €0.37, €0.56, €0.75 * 2.2)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 200, 399, 1, 0.42), -- €0.19 * 2.2
('paper_bag', 200, 399, 2, 0.81), -- €0.37 * 2.2
('paper_bag', 200, 399, 3, 1.23), -- €0.56 * 2.2
('paper_bag', 200, 399, 4, 1.65), -- €0.75 * 2.2
('paper_bag', 200, 399, 5, 1.65), -- Same as 4 colors
('paper_bag', 200, 399, 6, 1.65), -- Same as 4 colors
('paper_bag', 200, 399, 7, 1.65), -- Same as 4 colors
('paper_bag', 200, 399, 8, 1.65); -- Same as 4 colors

-- Quantity range 400-699 (from image 500-1499: €0.26, €0.49, €0.68, €0.87 * 2.2)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 400, 699, 1, 0.57), -- €0.26 * 2.2
('paper_bag', 400, 699, 2, 1.08), -- €0.49 * 2.2
('paper_bag', 400, 699, 3, 1.50), -- €0.68 * 2.2
('paper_bag', 400, 699, 4, 1.91), -- €0.87 * 2.2
('paper_bag', 400, 699, 5, 1.91), -- Same as 4 colors
('paper_bag', 400, 699, 6, 1.91), -- Same as 4 colors
('paper_bag', 400, 699, 7, 1.91), -- Same as 4 colors
('paper_bag', 400, 699, 8, 1.91); -- Same as 4 colors

-- Quantity range 700-999 (same as 400-699)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 700, 999, 1, 0.57), -- €0.26 * 2.2
('paper_bag', 700, 999, 2, 1.08), -- €0.49 * 2.2
('paper_bag', 700, 999, 3, 1.50), -- €0.68 * 2.2
('paper_bag', 700, 999, 4, 1.91), -- €0.87 * 2.2
('paper_bag', 700, 999, 5, 1.91), -- Same as 4 colors
('paper_bag', 700, 999, 6, 1.91), -- Same as 4 colors
('paper_bag', 700, 999, 7, 1.91), -- Same as 4 colors
('paper_bag', 700, 999, 8, 1.91); -- Same as 4 colors

-- Quantity range 1000-1499 (same as 400-699)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 1000, 1499, 1, 0.57), -- €0.26 * 2.2
('paper_bag', 1000, 1499, 2, 1.08), -- €0.49 * 2.2
('paper_bag', 1000, 1499, 3, 1.50), -- €0.68 * 2.2
('paper_bag', 1000, 1499, 4, 1.91), -- €0.87 * 2.2
('paper_bag', 1000, 1499, 5, 1.91), -- Same as 4 colors
('paper_bag', 1000, 1499, 6, 1.91), -- Same as 4 colors
('paper_bag', 1000, 1499, 7, 1.91), -- Same as 4 colors
('paper_bag', 1000, 1499, 8, 1.91); -- Same as 4 colors

-- Quantity range 1500-9999 (from image 1500+: using best pricing * 2.2)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 1500, 9999, 1, 0.57), -- Best price * 2.2
('paper_bag', 1500, 9999, 2, 1.08), -- Best price * 2.2
('paper_bag', 1500, 9999, 3, 1.50), -- Best price * 2.2
('paper_bag', 1500, 9999, 4, 1.91), -- Best price * 2.2
('paper_bag', 1500, 9999, 5, 1.91), -- Same as 4 colors
('paper_bag', 1500, 9999, 6, 1.91), -- Same as 4 colors
('paper_bag', 1500, 9999, 7, 1.91), -- Same as 4 colors
('paper_bag', 1500, 9999, 8, 1.91); -- Same as 4 colors