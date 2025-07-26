-- Add priority field to products table
-- Priority ranges from 1 to 100, where 1 is highest priority (shown first)
ALTER TABLE products ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 50 CHECK (priority >= 1 AND priority <= 100);

-- Create index for better performance when sorting by priority
CREATE INDEX IF NOT EXISTS idx_products_priority ON products (priority ASC);

-- Update existing products to have default priority of 50
UPDATE products SET priority = 50 WHERE priority IS NULL; 