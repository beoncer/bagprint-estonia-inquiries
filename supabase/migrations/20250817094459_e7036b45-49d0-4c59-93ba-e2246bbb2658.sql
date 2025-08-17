-- Delete all existing paper bag category pricing
DELETE FROM category_print_prices WHERE product_type = 'paper_bag';

-- Insert correct paper bag pricing based on image multiplied by 2.2
-- 1-99 range (from 50-99 pcs in image)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
('paper_bag', 1, 99, 1, 0.64),
('paper_bag', 1, 99, 2, 1.30),
('paper_bag', 1, 99, 3, 1.94),
('paper_bag', 1, 99, 4, 2.57),
('paper_bag', 1, 99, 5, 3.21),
('paper_bag', 1, 99, 6, 3.85),
('paper_bag', 1, 99, 7, 4.49),
('paper_bag', 1, 99, 8, 5.13),

-- 100-199 range
('paper_bag', 100, 199, 1, 0.37),
('paper_bag', 100, 199, 2, 0.75),
('paper_bag', 100, 199, 3, 1.12),
('paper_bag', 100, 199, 4, 1.50),
('paper_bag', 100, 199, 5, 1.87),
('paper_bag', 100, 199, 6, 2.25),
('paper_bag', 100, 199, 7, 2.62),
('paper_bag', 100, 199, 8, 3.00),

-- 200-399 range (from 200-499 pcs in image)
('paper_bag', 200, 399, 1, 0.26),
('paper_bag', 200, 399, 2, 0.53),
('paper_bag', 200, 399, 3, 0.81),
('paper_bag', 200, 399, 4, 1.08),
('paper_bag', 200, 399, 5, 1.35),
('paper_bag', 200, 399, 6, 1.62),
('paper_bag', 200, 399, 7, 1.89),
('paper_bag', 200, 399, 8, 2.16),

-- 400-699 range (from 500-1999 pcs in image)
('paper_bag', 400, 699, 1, 0.20),
('paper_bag', 400, 699, 2, 0.33),
('paper_bag', 400, 699, 3, 0.48),
('paper_bag', 400, 699, 4, 0.64),
('paper_bag', 400, 699, 5, 0.80),
('paper_bag', 400, 699, 6, 0.96),
('paper_bag', 400, 699, 7, 1.12),
('paper_bag', 400, 699, 8, 1.28),

-- 700-999 range (same as 400-699)
('paper_bag', 700, 999, 1, 0.20),
('paper_bag', 700, 999, 2, 0.33),
('paper_bag', 700, 999, 3, 0.48),
('paper_bag', 700, 999, 4, 0.64),
('paper_bag', 700, 999, 5, 0.80),
('paper_bag', 700, 999, 6, 0.96),
('paper_bag', 700, 999, 7, 1.12),
('paper_bag', 700, 999, 8, 1.28),

-- 1000-1499 range (same as 400-699)
('paper_bag', 1000, 1499, 1, 0.20),
('paper_bag', 1000, 1499, 2, 0.33),
('paper_bag', 1000, 1499, 3, 0.48),
('paper_bag', 1000, 1499, 4, 0.64),
('paper_bag', 1000, 1499, 5, 0.80),
('paper_bag', 1000, 1499, 6, 0.96),
('paper_bag', 1000, 1499, 7, 1.12),
('paper_bag', 1000, 1499, 8, 1.28),

-- 1500-9999 range (from 1500-2999 pcs in image)
('paper_bag', 1500, 9999, 1, 0.18),
('paper_bag', 1500, 9999, 2, 0.29),
('paper_bag', 1500, 9999, 3, 0.44),
('paper_bag', 1500, 9999, 4, 0.57),
('paper_bag', 1500, 9999, 5, 0.71),
('paper_bag', 1500, 9999, 6, 0.86),
('paper_bag', 1500, 9999, 7, 1.00),
('paper_bag', 1500, 9999, 8, 1.14);