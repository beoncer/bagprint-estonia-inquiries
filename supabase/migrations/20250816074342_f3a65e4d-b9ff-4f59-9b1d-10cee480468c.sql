-- Enable RLS on print_prices and quantity_multipliers tables
ALTER TABLE print_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantity_multipliers ENABLE ROW LEVEL SECURITY;

-- Allow read access for all authenticated users
CREATE POLICY "Allow read access for all authenticated users on print_prices"
    ON print_prices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access for all authenticated users on quantity_multipliers"
    ON quantity_multipliers FOR SELECT
    TO authenticated
    USING (true);

-- Allow write access only for admin users
CREATE POLICY "Allow write access for admin users on print_prices"
    ON print_prices FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow write access for admin users on quantity_multipliers"
    ON quantity_multipliers FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');