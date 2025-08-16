-- Migration: Add category-specific pricing support
-- Date: 2025-01-28
-- Description: Adds category-specific quantity multipliers and print prices

-- Create category_quantity_multipliers table
CREATE TABLE IF NOT EXISTS category_quantity_multipliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_type VARCHAR(50) NOT NULL, -- References products.type
    quantity_range_start INTEGER NOT NULL,
    quantity_range_end INTEGER NOT NULL,
    multiplier DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraints
    CONSTRAINT category_quantity_range_valid CHECK (quantity_range_start < quantity_range_end),
    CONSTRAINT category_multiplier_valid CHECK (multiplier > 0),
    CONSTRAINT unique_category_quantity_range UNIQUE (product_type, quantity_range_start, quantity_range_end),
    CONSTRAINT valid_product_type CHECK (product_type = ANY (ARRAY['cotton_bag', 'paper_bag', 'drawstring_bag', 'shoebag', 'packaging_box']))
);

-- Create category_print_prices table
CREATE TABLE IF NOT EXISTS category_print_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_type VARCHAR(50) NOT NULL, -- References products.type
    quantity_range_start INTEGER NOT NULL,
    quantity_range_end INTEGER NOT NULL,
    colors_count INTEGER NOT NULL,
    price_per_item DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraints
    CONSTRAINT category_print_quantity_range_valid CHECK (quantity_range_start < quantity_range_end),
    CONSTRAINT category_colors_count_valid CHECK (colors_count BETWEEN 1 AND 8),
    CONSTRAINT category_price_valid CHECK (price_per_item >= 0),
    CONSTRAINT unique_category_pricing_combination UNIQUE (product_type, quantity_range_start, quantity_range_end, colors_count),
    CONSTRAINT valid_category_product_type CHECK (product_type = ANY (ARRAY['cotton_bag', 'paper_bag', 'drawstring_bag', 'shoebag', 'packaging_box']))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_quantity_multipliers_type ON category_quantity_multipliers (product_type);
CREATE INDEX IF NOT EXISTS idx_category_quantity_multipliers_range ON category_quantity_multipliers (product_type, quantity_range_start, quantity_range_end);
CREATE INDEX IF NOT EXISTS idx_category_print_prices_type ON category_print_prices (product_type);
CREATE INDEX IF NOT EXISTS idx_category_print_prices_range_colors ON category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_category_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_category_quantity_multipliers_updated_at
    BEFORE UPDATE ON category_quantity_multipliers
    FOR EACH ROW
    EXECUTE FUNCTION update_category_pricing_updated_at();

CREATE TRIGGER update_category_print_prices_updated_at
    BEFORE UPDATE ON category_print_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_category_pricing_updated_at();

-- Seed some example category-specific pricing (you can modify these values)
-- Cotton bags: Better bulk discounts due to higher production efficiency
INSERT INTO category_quantity_multipliers (product_type, quantity_range_start, quantity_range_end, multiplier) VALUES
('cotton_bag', 1, 99, 1.0),
('cotton_bag', 100, 199, 0.85),    -- Better than global 0.9
('cotton_bag', 200, 399, 0.75),    -- Better than global 0.8
('cotton_bag', 400, 699, 0.65),    -- Better than global 0.75
('cotton_bag', 700, 999, 0.60),    -- Better than global 0.7
('cotton_bag', 1000, 1499, 0.55),  -- Better than global 0.65
('cotton_bag', 1500, 9999, 0.50)   -- Better than global 0.65
ON CONFLICT (product_type, quantity_range_start, quantity_range_end) DO NOTHING;

-- Paper bags: Standard bulk discounts
INSERT INTO category_quantity_multipliers (product_type, quantity_range_start, quantity_range_end, multiplier) VALUES
('paper_bag', 1, 99, 1.0),
('paper_bag', 100, 199, 0.90),     -- Same as global
('paper_bag', 200, 399, 0.80),     -- Same as global
('paper_bag', 400, 699, 0.75),     -- Same as global
('paper_bag', 700, 999, 0.70),     -- Same as global
('paper_bag', 1000, 1499, 0.65),   -- Same as global
('paper_bag', 1500, 9999, 0.65)    -- Same as global
ON CONFLICT (product_type, quantity_range_start, quantity_range_end) DO NOTHING;

-- Example category-specific print prices (cotton bags cost more to print on)
INSERT INTO category_print_prices (product_type, quantity_range_start, quantity_range_end, colors_count, price_per_item) VALUES
-- Cotton bags: Higher print costs due to material complexity
('cotton_bag', 1, 99, 1, 1.50),    -- Higher than global 1.20
('cotton_bag', 1, 99, 2, 1.80),    -- Higher than global 1.50
('cotton_bag', 1, 99, 3, 2.10),    -- Higher than global 1.80
('cotton_bag', 1, 99, 4, 2.40),    -- Higher than global 2.10
('cotton_bag', 1, 99, 5, 2.70),    -- Higher than global 2.40
('cotton_bag', 1, 99, 6, 3.00),    -- Higher than global 2.70
('cotton_bag', 1, 99, 7, 3.30),    -- Higher than global 3.00
('cotton_bag', 1, 99, 8, 3.60),    -- Higher than global 3.30

-- Paper bags: Standard print costs
('paper_bag', 1, 99, 1, 1.20),     -- Same as global
('paper_bag', 1, 99, 2, 1.50),     -- Same as global
('paper_bag', 1, 99, 3, 1.80),     -- Same as global
('paper_bag', 1, 99, 4, 2.10),     -- Same as global
('paper_bag', 1, 99, 5, 2.40),     -- Same as global
('paper_bag', 1, 99, 6, 2.70),     -- Same as global
('paper_bag', 1, 99, 7, 3.00),     -- Same as global
('paper_bag', 1, 99, 8, 3.30)      -- Same as global
ON CONFLICT (product_type, quantity_range_start, quantity_range_end, colors_count) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE category_quantity_multipliers IS 'Category-specific quantity multipliers for bulk discounts. Falls back to global rules if no category-specific rule exists.';
COMMENT ON TABLE category_print_prices IS 'Category-specific print prices. Falls back to global rules if no category-specific rule exists.';
COMMENT ON COLUMN category_quantity_multipliers.product_type IS 'Product category type that matches products.type';
COMMENT ON COLUMN category_print_prices.product_type IS 'Product category type that matches products.type';
