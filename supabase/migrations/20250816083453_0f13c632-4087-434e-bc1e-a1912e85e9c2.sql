-- Update quantity multipliers with new values from the pricing table
DELETE FROM quantity_multipliers;

INSERT INTO quantity_multipliers (quantity_range_start, quantity_range_end, multiplier) VALUES
(1, 99, 1.0),      -- Base price for small quantities
(100, 199, 1.3000),
(200, 399, 1.2000),
(400, 699, 1.1500),
(700, 999, 1.1000),
(1000, 1499, 1.0500),
(1500, 9999, 1.0000); -- Highest tier for 1500+