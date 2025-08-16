# 🚨 PRICING FIX GUIDE - URGENT ACTION REQUIRED

## 🎯 **The Problem**
Your global quantity multipliers are **INCREASING prices instead of decreasing them** for bulk orders. This is why you're seeing €1.19 instead of €0.76.

**Current Broken Values:**
- 1-99: 1.0 ✅ (correct)
- 100-199: 1.3 ❌ (30% INCREASE!)
- 200-399: 1.2 ❌ (20% INCREASE!)
- 400-699: 1.15 ❌ (15% INCREASE!)

**Should Be:**
- 1-99: 1.0 (no change)
- 100-199: 0.9 (10% discount)
- 200-399: 0.8 (20% discount)
- 400-699: 0.75 (25% discount)

## 🔧 **STEP 1: Fix Global Pricing (URGENT)**

### **Option A: Run Migration (Recommended)**
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste this migration:

```sql
-- FIX GLOBAL QUANTITY MULTIPLIERS
DELETE FROM quantity_multipliers;

INSERT INTO quantity_multipliers (quantity_range_start, quantity_range_end, multiplier) VALUES
(1, 99, 1.00),      -- No discount for small orders
(100, 199, 0.90),   -- 10% discount
(200, 399, 0.80),   -- 20% discount
(400, 699, 0.75),   -- 25% discount
(700, 999, 0.70),   -- 30% discount
(1000, 1499, 0.65), -- 35% discount
(1500, 9999, 0.60)  -- 40% discount
ON CONFLICT (quantity_range_start, quantity_range_end) DO NOTHING;
```

4. Click **Run** to execute

### **Option B: Use Admin Panel**
1. Go to **Admin → Pricing**
2. Edit the **Global Pricing** tab
3. Change the multipliers to the correct values above

## 🗄️ **STEP 2: Setup Category-Specific Pricing**

### **Run Category Pricing Migration**
1. In Supabase SQL Editor, run this migration:

```sql
-- CREATE CATEGORY-SPECIFIC PRICING TABLES
-- (Copy the entire content from: supabase/migrations/20250128000001_add_category_specific_pricing.sql)
```

2. This will create the new tables and seed example data

## ✅ **STEP 3: Verify Everything Works**

### **Test Script**
Run this in Supabase SQL Editor to verify:

```sql
-- VERIFY GLOBAL PRICING IS FIXED
SELECT 
    quantity_range_start,
    quantity_range_end,
    multiplier,
    CASE 
        WHEN multiplier < 1.0 THEN 'DISCOUNT ✅'
        WHEN multiplier = 1.0 THEN 'NO CHANGE ✅'
        ELSE 'INCREASE ❌'
    END as status
FROM quantity_multipliers 
ORDER BY quantity_range_start;

-- VERIFY CATEGORY TABLES EXIST
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('category_quantity_multipliers', 'category_print_prices');
```

### **Expected Results:**
- All global multipliers should show "DISCOUNT ✅" or "NO CHANGE ✅"
- Category tables should exist
- No "INCREASE ❌" should appear

## 🧪 **STEP 4: Test the Complete Flow**

### **Test Case: Cotton Bag**
1. **Base Price**: €0.76
2. **Quantity**: 1
3. **Expected Result**: €0.76 × 1.0 = **€0.76** ✅

### **Test Case: Cotton Bag with Bulk**
1. **Base Price**: €0.76
2. **Quantity**: 500
3. **Expected Result**: €0.76 × 0.75 = **€0.57** ✅

### **Test Case: Cotton Bag with Custom Category Rule**
1. **Base Price**: €0.76
2. **Quantity**: 500
3. **Category Rule**: 0.65 (better than global 0.75)
4. **Expected Result**: €0.76 × 0.65 = **€0.49** ✅

## 🎯 **What This Fixes**

### **Before (Broken):**
- 1 cotton bag: €0.76 × 1.0 = €0.76 ✅
- 500 cotton bags: €0.76 × 1.15 = €0.87 ❌ (WRONG!)

### **After (Fixed):**
- 1 cotton bag: €0.76 × 1.0 = €0.76 ✅
- 500 cotton bags: €0.76 × 0.75 = €0.57 ✅ (CORRECT!)

## 🚀 **Next Steps**

1. **Run the global pricing fix** (STEP 1)
2. **Run the category pricing migration** (STEP 2)
3. **Verify with test script** (STEP 3)
4. **Test on your website** (STEP 4)
5. **Configure category-specific rules** in admin panel

## 📞 **Need Help?**

If you encounter any issues:
1. Check the Supabase logs for errors
2. Verify the migration ran successfully
3. Test with the verification script
4. Check that your admin panel shows the correct values

---

**⚠️ IMPORTANT: Fix the global pricing FIRST, then the category pricing will work perfectly!**
