
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS print_prices CASCADE;
DROP TABLE IF EXISTS quantity_multipliers CASCADE;

-- Create quantity_multipliers table
CREATE TABLE quantity_multipliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quantity_range_start INTEGER NOT NULL,
    quantity_range_end INTEGER NOT NULL,
    multiplier DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraints
    CONSTRAINT quantity_range_valid CHECK (quantity_range_start < quantity_range_end),
    CONSTRAINT multiplier_valid CHECK (multiplier > 0),
    CONSTRAINT unique_quantity_range UNIQUE (quantity_range_start, quantity_range_end)
);

-- Create print_prices table
CREATE TABLE print_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quantity_range_start INTEGER NOT NULL,
    quantity_range_end INTEGER NOT NULL,
    colors_count INTEGER NOT NULL,
    price_per_item DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraints
    CONSTRAINT quantity_range_valid CHECK (quantity_range_start < quantity_range_end),
    CONSTRAINT colors_count_valid CHECK (colors_count BETWEEN 1 AND 8),
    CONSTRAINT price_valid CHECK (price_per_item >= 0),
    CONSTRAINT unique_pricing_combination UNIQUE (quantity_range_start, quantity_range_end, colors_count)
);

-- Create indexes for better performance
CREATE INDEX idx_quantity_multipliers_range ON quantity_multipliers (quantity_range_start, quantity_range_end);
CREATE INDEX idx_print_prices_range_colors ON print_prices (quantity_range_start, quantity_range_end, colors_count);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_quantity_multipliers_updated_at
    BEFORE UPDATE ON quantity_multipliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_print_prices_updated_at
    BEFORE UPDATE ON print_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed quantity multipliers (bulk discounts)
INSERT INTO quantity_multipliers (quantity_range_start, quantity_range_end, multiplier) VALUES
(1, 50, 1.00),      -- No discount for small orders
(51, 100, 0.95),    -- 5% discount
(101, 200, 0.90),   -- 10% discount
(201, 300, 0.85),   -- 15% discount
(301, 500, 0.80),   -- 20% discount
(501, 800, 0.75),   -- 25% discount
(801, 1000, 0.70),  -- 30% discount
(1001, 9999, 0.65)  -- 35% discount for very large orders
ON CONFLICT (quantity_range_start, quantity_range_end) DO NOTHING;

-- Seed print prices (quantity ranges x color counts matrix)
-- Quantity range 1-50
INSERT INTO print_prices (quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
(1, 50, 1, 1.20), (1, 50, 2, 1.50), (1, 50, 3, 1.80), (1, 50, 4, 2.10),
(1, 50, 5, 2.40), (1, 50, 6, 2.70), (1, 50, 7, 3.00), (1, 50, 8, 3.30),

-- Quantity range 51-100
(51, 100, 1, 1.00), (51, 100, 2, 1.25), (51, 100, 3, 1.50), (51, 100, 4, 1.75),
(51, 100, 5, 2.00), (51, 100, 6, 2.25), (51, 100, 7, 2.50), (51, 100, 8, 2.75),

-- Quantity range 101-200
(101, 200, 1, 0.85), (101, 200, 2, 1.05), (101, 200, 3, 1.25), (101, 200, 4, 1.45),
(101, 200, 5, 1.65), (101, 200, 6, 1.85), (101, 200, 7, 2.05), (101, 200, 8, 2.25),

-- Quantity range 201-300
(201, 300, 1, 0.75), (201, 300, 2, 0.95), (201, 300, 3, 1.15), (201, 300, 4, 1.35),
(201, 300, 5, 1.55), (201, 300, 6, 1.75), (201, 300, 7, 1.95), (201, 300, 8, 2.15),

-- Quantity range 301-500
(301, 500, 1, 0.65), (301, 500, 2, 0.80), (301, 500, 3, 0.95), (301, 500, 4, 1.10),
(301, 500, 5, 1.25), (301, 500, 6, 1.40), (301, 500, 7, 1.55), (301, 500, 8, 1.70),

-- Quantity range 501-800
(501, 800, 1, 0.55), (501, 800, 2, 0.70), (501, 800, 3, 0.85), (501, 800, 4, 1.00),
(501, 800, 5, 1.15), (501, 800, 6, 1.30), (501, 800, 7, 1.45), (501, 800, 8, 1.60),

-- Quantity range 801-1000
(801, 1000, 1, 0.50), (801, 1000, 2, 0.65), (801, 1000, 3, 0.80), (801, 1000, 4, 0.95),
(801, 1000, 5, 1.10), (801, 1000, 6, 1.25), (801, 1000, 7, 1.40), (801, 1000, 8, 1.55),

-- Quantity range 1001+
(1001, 9999, 1, 0.45), (1001, 9999, 2, 0.60), (1001, 9999, 3, 0.75), (1001, 9999, 4, 0.90),
(1001, 9999, 5, 1.05), (1001, 9999, 6, 1.20), (1001, 9999, 7, 1.35), (1001, 9999, 8, 1.50)
ON CONFLICT (quantity_range_start, quantity_range_end, colors_count) DO NOTHING;
