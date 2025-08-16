import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePricing } from '@/hooks/usePricing';
import { toast } from 'sonner';

interface CategoryQuantityMultipliersManagerProps {
  productType: string;
  onSuccess?: () => void;
}

export function CategoryQuantityMultipliersManager({ productType, onSuccess }: CategoryQuantityMultipliersManagerProps) {
  const {
    quantityMultipliers: globalMultipliers,
    categoryQuantityMultipliers,
    updateCategoryQuantityMultiplier,
    createCategoryQuantityMultiplier,
    deleteCategoryQuantityMultiplier,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);
  const [newRange, setNewRange] = useState({ start: '', end: '', multiplier: '' });

  // Get category-specific multipliers for this product type
  const categoryMultipliers = categoryQuantityMultipliers.filter(m => m.product_type === productType);
  
  // Create a matrix showing both global and category-specific rules
  const pricingMatrix = globalMultipliers.map(globalRange => {
    const categoryRule = categoryMultipliers.find(
      m => m.quantity_range_start === globalRange.quantity_range_start &&
           m.quantity_range_end === globalRange.quantity_range_end
    );
    
    return {
      globalRange,
      categoryRule,
      isCustomized: !!categoryRule,
      effectiveMultiplier: categoryRule ? categoryRule.multiplier : globalRange.multiplier,
    };
  });

  const handleMultiplierChange = async (rangeStart: number, rangeEnd: number, value: string, existingId?: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) return;

    try {
      if (existingId) {
        await updateCategoryQuantityMultiplier({
          id: existingId,
          multiplier: numericValue,
        });
      } else {
        await createCategoryQuantityMultiplier({
          product_type: productType,
          quantity_range_start: rangeStart,
          quantity_range_end: rangeEnd,
          multiplier: numericValue,
        });
      }
      toast.success('Category multiplier updated successfully');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to update category multiplier');
    }
  };

  const handleDeleteCustomRule = async (id: string) => {
    try {
      await deleteCategoryQuantityMultiplier(id);
      toast.success('Custom rule removed, now using global pricing');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to remove custom rule');
    }
  };

  const handleAddNewRange = async () => {
    const start = parseInt(newRange.start);
    const end = parseInt(newRange.end);
    const multiplier = parseFloat(newRange.multiplier);

    if (isNaN(start) || isNaN(end) || isNaN(multiplier) || start >= end || multiplier <= 0) {
      toast.error('Please enter valid range and multiplier values');
      return;
    }

    // Check for overlapping ranges
    const hasOverlap = [...globalMultipliers, ...categoryMultipliers].some(
      range => (start <= range.quantity_range_end && end >= range.quantity_range_start)
    );

    if (hasOverlap) {
      toast.error('This range overlaps with existing ranges');
      return;
    }

    try {
      await createCategoryQuantityMultiplier({
        product_type: productType,
        quantity_range_start: start,
        quantity_range_end: end,
        multiplier: multiplier,
      });
      
      setNewRange({ start: '', end: '', multiplier: '' });
      toast.success('New pricing range added successfully');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to add new pricing range');
    }
  };

  const getMultiplierDisplay = (item: any) => {
    if (item.isCustomized) {
      return (
        <div className="space-y-2">
          <Input
            type="number"
            value={item.effectiveMultiplier}
            onChange={e => handleMultiplierChange(
              item.globalRange.quantity_range_start,
              item.globalRange.quantity_range_end,
              e.target.value,
              item.categoryRule?.id
            )}
            step="0.01"
            min="0.1"
            max="1"
            className="w-24"
          />
          <Badge variant="secondary" className="text-xs">
            Custom
          </Badge>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <span className="text-gray-500">{item.effectiveMultiplier.toFixed(2)}</span>
        <Badge variant="outline" className="text-xs">
          Global
        </Badge>
      </div>
    );
  };

  const getDiscountPercent = (multiplier: number) => {
    const discountPercent = Math.round((1 - multiplier) * 100);
    return discountPercent > 0 ? `-${discountPercent}%` : 'No discount';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quantity Multipliers for {productType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          <p className="text-sm text-gray-600">
            Customize bulk discount rates for this category. Rules not set will use global pricing.
          </p>
        </div>
        <Button
          variant={editMode ? "default" : "outline"}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Changes" : "Edit Multipliers"}
        </Button>
      </div>

      {editMode && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Add New Pricing Range</h4>
          <div className="flex gap-3 items-end">
            <div>
              <label className="text-sm text-blue-700">Start Quantity</label>
              <Input
                type="number"
                value={newRange.start}
                onChange={e => setNewRange(prev => ({ ...prev, start: e.target.value }))}
                placeholder="e.g., 2000"
                min="1"
                className="w-32"
              />
            </div>
            <div>
              <label className="text-sm text-blue-700">End Quantity</label>
              <Input
                type="number"
                value={newRange.end}
                onChange={e => setNewRange(prev => ({ ...prev, end: e.target.value }))}
                placeholder="e.g., 2999"
                min="1"
                className="w-32"
              />
            </div>
            <div>
              <label className="text-sm text-blue-700">Multiplier</label>
              <Input
                type="number"
                value={newRange.multiplier}
                onChange={e => setNewRange(prev => ({ ...prev, multiplier: e.target.value }))}
                placeholder="e.g., 0.60"
                step="0.01"
                min="0.1"
                max="1"
                className="w-32"
              />
            </div>
            <Button onClick={handleAddNewRange} size="sm">
              Add Range
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quantity Range</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Example (€10 base)</TableHead>
              <TableHead>Source</TableHead>
              {editMode && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingMatrix.map((item) => {
              const discountPercent = getDiscountPercent(item.effectiveMultiplier);
              const examplePrice = (10 * item.effectiveMultiplier).toFixed(2);
              
              return (
                <TableRow key={`${item.globalRange.quantity_range_start}-${item.globalRange.quantity_range_end}`}>
                  <TableCell className="font-medium">
                    {item.globalRange.quantity_range_start}-{item.globalRange.quantity_range_end === 9999 ? '∞' : item.globalRange.quantity_range_end}
                  </TableCell>
                  <TableCell>
                    {getMultiplierDisplay(item)}
                  </TableCell>
                  <TableCell>
                    <span className={discountPercent.includes('-') ? 'text-green-600' : ''}>
                      {discountPercent}
                    </span>
                  </TableCell>
                  <TableCell>€{examplePrice}</TableCell>
                  <TableCell>
                    {item.isCustomized ? (
                      <Badge variant="secondary">Custom</Badge>
                    ) : (
                      <Badge variant="outline">Global</Badge>
                    )}
                  </TableCell>
                  {editMode && (
                    <TableCell>
                      {item.isCustomized && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomRule(item.categoryRule!.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 text-sm text-gray-500">
        <p>
          * Multipliers are applied to the base price. Lower multiplier = bigger discount.
        </p>
        <p>
          * Custom rules override global pricing for this category.
        </p>
        <p>
          * Rules not set will automatically use global pricing.
        </p>
      </div>
    </div>
  );
}
