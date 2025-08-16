# Category-Specific Pricing Implementation Guide

## Overview

This implementation adds category-specific pricing to your bag printing business, allowing you to set different pricing rules for each product category while maintaining backward compatibility with your existing global pricing system.

## What's New

### 1. **Category-Specific Quantity Multipliers**
- Different bulk discount rates for each product type
- Cotton bags can have better bulk discounts due to production efficiency
- Paper bags can maintain standard rates
- Each category can have its own pricing strategy

### 2. **Category-Specific Print Prices**
- Different print costs based on material complexity
- Cotton bags: Higher print costs due to fabric complexity
- Paper bags: Standard print costs
- Custom pricing for specialized materials

### 3. **Smart Fallback System**
- If no category-specific rule exists, automatically uses global pricing
- Ensures existing functionality continues to work
- Gradual migration possible - set rules for categories one by one

## Database Structure

### New Tables

#### `category_quantity_multipliers`
```sql
- id: UUID (Primary Key)
- product_type: VARCHAR(50) - References products.type
- quantity_range_start: INTEGER - Start of quantity range
- quantity_range_end: INTEGER - End of quantity range
- multiplier: DECIMAL(10,2) - Discount multiplier
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `category_print_prices`
```sql
- id: UUID (Primary Key)
- product_type: VARCHAR(50) - References products.type
- quantity_range_start: INTEGER - Start of quantity range
- quantity_range_end: INTEGER - End of quantity range
- colors_count: INTEGER - Number of colors (1-8)
- price_per_item: DECIMAL(10,2) - Print cost per item
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Supported Product Types
- `cotton_bag` - Fabric bags with custom printing
- `paper_bag` - Eco-friendly paper bags
- `drawstring_bag` - String-tied fabric bags
- `shoebag` - Specialized shoe storage bags
- `packaging_box` - Custom printed boxes

## How It Works

### 1. **Pricing Priority System**
```
1. Category-specific rule (if exists)
2. Global rule (fallback)
3. Default multiplier (1.0) if no rules exist
```

### 2. **Example Pricing Flow**
```
Product: Cotton Bag (cotton_bag)
Quantity: 500
Colors: 3

Step 1: Quantity Multiplier
- Look for cotton_bag rule for 400-699 range
- If found: Use category-specific multiplier (e.g., 0.65)
- If not found: Use global multiplier (e.g., 0.75)

Step 2: Print Price
- Look for cotton_bag rule for 400-699 range, 3 colors
- If found: Use category-specific price (e.g., €1.80)
- If not found: Use global price (e.g., €1.15)

Step 3: Calculate Final Price
- Base Price × Category Multiplier + Category Print Cost
- €2.00 × 0.65 + €1.80 = €3.10 per item
```

## Admin Panel Features

### **Category Pricing Manager**
- **Location**: Admin → Pricing → Category-Specific Pricing tab
- **Features**:
  - Overview of all product categories
  - Status indicators (Complete, Partial, Global Only)
  - Click to configure individual categories

### **Category Quantity Multipliers Manager**
- **Features**:
  - Edit existing category multipliers
  - Add new quantity ranges
  - Remove custom rules (revert to global)
  - Visual indicators for custom vs. global rules

### **Category Print Prices Manager**
- **Features**:
  - Edit print prices for each color count
  - Material-specific pricing guidance
  - Easy comparison with global pricing

## Usage Examples

### **Setting Up Cotton Bag Pricing**

1. **Navigate to**: Admin → Pricing → Category-Specific Pricing
2. **Click on**: Cotton Bags card
3. **Configure Quantity Multipliers**:
   - 100-199: 0.85 (better than global 0.90)
   - 200-399: 0.75 (better than global 0.80)
   - 400-699: 0.65 (better than global 0.75)
4. **Configure Print Prices**:
   - 1 Color: €1.50 (higher than global €1.20)
   - 2 Colors: €1.80 (higher than global €1.50)
   - 3 Colors: €2.10 (higher than global €1.80)

### **Setting Up Paper Bag Pricing**

1. **Keep Global Pricing**: Don't set any category-specific rules
2. **Result**: Paper bags automatically use global pricing
3. **Benefit**: No additional configuration needed

### **Adding New Quantity Ranges**

1. **Click**: "Edit Multipliers" button
2. **Add New Range**:
   - Start: 2000
   - End: 2999
   - Multiplier: 0.55
3. **Result**: New bulk discount tier for this category only

## Migration Strategy

### **Phase 1: Setup Infrastructure**
- Run the migration script
- Verify new tables are created
- Test admin panel access

### **Phase 2: Configure High-Impact Categories**
- Start with cotton bags (most complex, highest volume)
- Set quantity multipliers for better bulk discounts
- Set print prices reflecting material complexity

### **Phase 3: Configure Other Categories**
- Paper bags: Keep global pricing (simplest)
- Drawstring bags: Customize based on production costs
- Shoe bags: Specialized pricing if needed

### **Phase 4: Monitor and Optimize**
- Track pricing performance
- Adjust multipliers based on customer behavior
- Fine-tune print prices based on actual costs

## Benefits

### **1. Competitive Advantage**
- Cotton bags: Better bulk discounts for large orders
- Paper bags: Maintain competitive pricing
- Specialized products: Accurate cost-based pricing

### **2. Operational Efficiency**
- Different production costs reflected in pricing
- Material complexity factored into print costs
- Bulk production efficiency rewarded

### **3. Customer Experience**
- Transparent pricing based on actual costs
- Fair pricing for different materials
- Incentives for larger orders where appropriate

### **4. Business Intelligence**
- Category-specific pricing analytics
- Performance tracking by product type
- Data-driven pricing decisions

## Technical Implementation

### **Frontend Components**
- `CategoryPricingManager`: Main category overview
- `CategoryQuantityMultipliersManager`: Bulk discount management
- `CategoryPrintPricesManager`: Print cost management

### **Backend Hooks**
- `usePricing`: Enhanced with category-specific functions
- `useProductPricing`: Updated to use category pricing

### **Database Functions**
- Automatic fallback to global pricing
- Constraint validation for product types
- Efficient indexing for performance

## Troubleshooting

### **Common Issues**

1. **Category rules not taking effect**
   - Check if product.type matches exactly
   - Verify quantity ranges don't overlap
   - Ensure multipliers are valid (0.1 to 1.0)

2. **Print prices not updating**
   - Verify color count is between 1-8
   - Check quantity range constraints
   - Ensure price_per_item is non-negative

3. **Performance issues**
   - Check database indexes are created
   - Monitor query performance
   - Consider caching for high-traffic scenarios

### **Debug Mode**
- Enable console logging in usePricing hook
- Check database queries in Supabase logs
- Verify data consistency between tables

## Future Enhancements

### **Potential Features**
1. **Seasonal Pricing**: Different rates for peak/off-peak periods
2. **Customer Tier Pricing**: VIP customer discounts
3. **Geographic Pricing**: Regional cost variations
4. **Bulk Order Thresholds**: Custom breakpoints per category
5. **Material Cost Integration**: Automatic price adjustments

### **API Extensions**
1. **Pricing API**: External access to pricing rules
2. **Bulk Updates**: Mass pricing changes
3. **Pricing History**: Track pricing changes over time
4. **Export/Import**: CSV-based pricing management

## Conclusion

This category-specific pricing system provides a robust foundation for differentiated pricing while maintaining the simplicity of your existing global pricing structure. It allows you to:

- **Optimize pricing** for different product types
- **Reflect actual costs** in your pricing strategy
- **Maintain flexibility** for future pricing changes
- **Improve competitiveness** in different market segments

The system is designed to be:
- **Backward compatible** with existing functionality
- **Easy to use** through the admin panel
- **Scalable** for future business growth
- **Maintainable** with clear separation of concerns

Start with your highest-volume categories and gradually expand to others as needed. The fallback system ensures you can't break existing functionality while you're setting up the new pricing rules.
