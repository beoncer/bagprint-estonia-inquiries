-- Enable RLS on category pricing tables
ALTER TABLE category_print_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_quantity_multipliers ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for category_print_prices
CREATE POLICY "Allow read access for all users on category_print_prices"
    ON category_print_prices FOR SELECT
    USING (true);

CREATE POLICY "Allow write access for admin users on category_print_prices"
    ON category_print_prices FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add RLS policies for category_quantity_multipliers
CREATE POLICY "Allow read access for all users on category_quantity_multipliers"
    ON category_quantity_multipliers FOR SELECT
    USING (true);

CREATE POLICY "Allow write access for admin users on category_quantity_multipliers"
    ON category_quantity_multipliers FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');