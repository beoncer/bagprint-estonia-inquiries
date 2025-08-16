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
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

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

  const startEditing = (rangeStart: number, rangeEnd: number, currentValue: number) => {
    const cellKey = `${rangeStart}-${rangeEnd}`;
    setEditingCell(cellKey);
    setEditingValue(currentValue.toString());
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const saveEditing = async (rangeStart: number, rangeEnd: number, existingId?: string) => {
    const numericValue = parseFloat(editingValue);
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error('Please enter a valid multiplier value');
      return;
    }

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
      setEditingCell(null);
      setEditingValue('');
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
      toast.success('New pricing range added successfully');
      setNewRange({ start: '', end: '', multiplier: '' });
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to add new pricing range');
    }
  };

  const getMultiplierDisplay = (item: any) => {
    const cellKey = `${item.globalRange.quantity_range_start}-${item.globalRange.quantity_range_end}`;
    const isEditing = editingCell === cellKey;

    if (isEditing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              step="0.01"
              min="0.1"
              max="1"
              className="w-24"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => saveEditing(
                item.globalRange.quantity_range_start,
                item.globalRange.quantity_range_end,
                item.categoryRule?.id
              )}
              className="h-8 px-2"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEditing}
              className="h-8 px-2"
            >
              ✕
            </Button>
          </div>
          <Badge variant="secondary" className="text-xs">
            {item.isCustomized ? 'Custom' : 'New Custom'}
          </Badge>
        </div>
      );
    }

    if (item.isCustomized) {
      return (
        <div className="space-y-2">
          <div 
            className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-gray-300"
            onClick={() => startEditing(
              item.globalRange.quantity_range_start,
              item.globalRange.quantity_range_end,
              item.effectiveMultiplier
            )}
          >
            <span className="font-medium">{item.effectiveMultiplier.toFixed(2)}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Custom
          </Badge>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div 
          className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-gray-300"
          onClick={() => startEditing(
            item.globalRange.quantity_range_start,
            item.globalRange.quantity_range_end,
            item.effectiveMultiplier
          )}
        >
          <span className="text-gray-500">{item.effectiveMultiplier.toFixed(2)}</span>
        </div>
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
            Click on any multiplier to customize it. Custom rules override global pricing for this category.
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
          * <strong>Click on any multiplier to customize it</strong> - this will create a category-specific rule.
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
