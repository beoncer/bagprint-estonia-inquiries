# Size Multipliers Implementation Guide

## Overview
This implementation adds size-based pricing to your product system, allowing you to set different price multipliers for each size of a product.

## Database Changes

### New Column
- **Table**: `products`
- **Column**: `size_multipliers`
- **Type**: `JSONB`
- **Default**: `{}` (empty object)
- **Index**: GIN index for efficient querying

### Example Data Structure
```json
{
  "size_multipliers": {
    "11x20cm": 1.0,
    "12x15cm": 1.1,
    "13x18cm": 1.2,
    "15x20cm": 1.3
  }
}
```

## How It Works

### 1. **Base Price + Size Multiplier**
- Each product has a `base_price`
- Each size has a multiplier (e.g., 1.2 = 20% increase)
- Final price = `base_price × quantity_multiplier × size_multiplier + print_cost`

### 2. **Pricing Flow**
```
Base Price: €2.00
Quantity: 100 (gets 0.8x discount)
Size: "15x20cm" (gets 1.3x multiplier)
Print: 2 colors (adds €0.15 per item)

Calculation:
€2.00 × 0.8 × 1.3 + €0.15 = €2.23 per item
Total: €2.23 × 100 = €223.00
```

## Admin Panel Features

### **SizeMultipliersManager Component**
- **Location**: `src/components/admin/SizeMultipliersManager.tsx`
- **Features**:
  - Add new sizes with multipliers
  - Edit existing multipliers
  - Remove sizes and their multipliers
  - Real-time validation
  - Toast notifications for feedback

### **Integration Points**
- **Product Editor**: Add this component to your existing product editing interface
- **Size Management**: Automatically syncs with product sizes array
- **Data Persistence**: Saves directly to Supabase

## Usage Examples

### **Setting Up a New Product**
1. Create product with base price €2.00
2. Add sizes: "Small", "Medium", "Large"
3. Set multipliers: 1.0, 1.2, 1.5
4. Result: Small = €2.00, Medium = €2.40, Large = €3.00

### **Updating Existing Products**
1. Open product in admin panel
2. Navigate to "Sizes & Multipliers" section
3. Add multipliers for existing sizes
4. Save changes

## Technical Implementation

### **Hooks**
- **`useSizeMultipliers(productId)`**: Manages size multipliers for a specific product
- **`usePricing()`**: Updated to include size multiplier calculations

### **Types**
- **`Product`**: Added `size_multipliers?: Record<string, number>`
- **`PriceCalculationInput`**: Added `size?` and `product?` parameters

### **Components**
- **`SizeMultipliersManager`**: Admin interface for managing multipliers
- **Integration**: Can be added to existing product editors

## Migration Steps

### **1. Run Database Migration**
```sql
-- Execute the migration file:
-- supabase/migrations/20250128000000_add_size_multipliers.sql
```

### **2. Update Your Product Editor**
Add the `SizeMultipliersManager` component to your existing product editing interface:

```tsx
import { SizeMultipliersManager } from '@/components/admin/SizeMultipliersManager';

// In your product editor component:
<SizeMultipliersManager 
  productId={product.id}
  sizes={product.sizes}
  onSizesChange={handleSizesChange}
/>
```

### **3. Update Pricing Calculations**
The pricing system automatically uses size multipliers when:
- A size is selected
- The product has `size_multipliers` data
- The `calculatePrice` function is called with both `size` and `product` parameters

## Benefits

### **Flexibility**
- **Individual Control**: Each product can have completely different size pricing
- **Dynamic Updates**: Change multipliers without affecting other products
- **Size-Specific**: Different materials can have different size pricing logic

### **Accuracy**
- **Real Costs**: Reflect actual material usage and production complexity
- **Market Pricing**: Charge appropriately for larger sizes
- **Profit Optimization**: Set multipliers based on your cost structure

### **User Experience**
- **Transparent Pricing**: Customers see size-specific pricing
- **Fair Billing**: Pay only for what they order
- **Clear Breakdown**: Understand how size affects final price

## Best Practices

### **Multiplier Values**
- **Small sizes**: 1.0 (baseline)
- **Medium sizes**: 1.1 - 1.3 (10-30% increase)
- **Large sizes**: 1.4 - 2.0 (40-100% increase)
- **Extra large**: 2.0+ (100%+ increase)

### **Naming Conventions**
- Use consistent size formats (e.g., "30x40cm", "Small", "Large")
- Keep size names short and descriptive
- Avoid special characters that might cause JSON parsing issues

### **Data Validation**
- Multipliers must be positive numbers
- Default to 1.0 for new sizes
- Validate input before saving to database

## Troubleshooting

### **Common Issues**
1. **Multipliers not applying**: Ensure `product` parameter is passed to `calculatePrice`
2. **JSON parsing errors**: Check for valid JSON in `size_multipliers` column
3. **Performance issues**: Verify GIN index is created on `size_multipliers`

### **Debug Steps**
1. Check browser console for errors
2. Verify database column exists and has correct data
3. Confirm component is properly integrated
4. Test with simple multiplier values first

## Future Enhancements

### **Potential Improvements**
- **Bulk editing**: Update multipliers for multiple products
- **Template system**: Apply common multiplier patterns
- **Analytics**: Track which sizes are most profitable
- **Import/Export**: CSV support for bulk updates
- **Audit trail**: Track multiplier changes over time 