-- Create print_prices table
create table if not exists print_prices (
    id uuid default uuid_generate_v4() primary key,
    quantity_range_start integer not null,
    quantity_range_end integer not null,
    colors_count integer not null,
    price_per_item decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraints
    constraint quantity_range_valid check (quantity_range_start < quantity_range_end),
    constraint colors_count_valid check (colors_count between 1 and 8)
);

-- Create quantity_multipliers table
create table if not exists quantity_multipliers (
    id uuid default uuid_generate_v4() primary key,
    quantity_range_start integer not null,
    quantity_range_end integer not null,
    multiplier decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraints
    constraint quantity_range_valid check (quantity_range_start < quantity_range_end),
    constraint multiplier_valid check (multiplier > 0)
);

-- Create indexes for better query performance
create index print_prices_quantity_range_idx on print_prices (quantity_range_start, quantity_range_end);
create index print_prices_colors_count_idx on print_prices (colors_count);
create index quantity_multipliers_range_idx on quantity_multipliers (quantity_range_start, quantity_range_end);

-- Create trigger function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for both tables
create trigger update_print_prices_updated_at
    before update on print_prices
    for each row
    execute function update_updated_at_column();

create trigger update_quantity_multipliers_updated_at
    before update on quantity_multipliers
    for each row
    execute function update_updated_at_column();

-- Add RLS policies
alter table print_prices enable row level security;
alter table quantity_multipliers enable row level security;

-- Allow read access for all authenticated users
create policy "Allow read access for all authenticated users on print_prices"
    on print_prices for select
    to authenticated
    using (true);

create policy "Allow read access for all authenticated users on quantity_multipliers"
    on quantity_multipliers for select
    to authenticated
    using (true);

-- Allow write access only for admin users
create policy "Allow write access for admin users on print_prices"
    on print_prices for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'admin')
    with check (auth.jwt() ->> 'role' = 'admin');

create policy "Allow write access for admin users on quantity_multipliers"
    on quantity_multipliers for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'admin')
    with check (auth.jwt() ->> 'role' = 'admin'); 