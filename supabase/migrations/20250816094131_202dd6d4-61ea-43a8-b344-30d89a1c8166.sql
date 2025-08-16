-- Enable RLS on tables that don't have it enabled
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for footer_content
CREATE POLICY "Allow public read access to footer_content"
    ON footer_content FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage footer_content"
    ON footer_content FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for guarantees
CREATE POLICY "Allow public read access to guarantees"
    ON guarantees FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage guarantees"
    ON guarantees FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for pages
CREATE POLICY "Allow public read access to pages"
    ON pages FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage pages"
    ON pages FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for portfolio
CREATE POLICY "Allow public read access to portfolio"
    ON portfolio FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage portfolio"
    ON portfolio FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for product_sizes
CREATE POLICY "Allow public read access to product_sizes"
    ON product_sizes FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage product_sizes"
    ON product_sizes FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');