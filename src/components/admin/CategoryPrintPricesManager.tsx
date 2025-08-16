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

interface CategoryPrintPricesManagerProps {
  productType: string;
  onSuccess?: () => void;
}

export function CategoryPrintPricesManager({ productType, onSuccess }: CategoryPrintPricesManagerProps) {
  const {
    printPrices: globalPrintPrices,
    categoryPrintPrices,
    updateCategoryPrintPrice,
    createCategoryPrintPrice,
    deleteCategoryPrintPrice,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Get category-specific print prices for this product type
  const categoryPrices = categoryPrintPrices.filter(p => p.product_type === productType);
  
  // Get unique quantity ranges from global pricing
  const quantityRanges = globalPrintPrices.reduce((ranges, price) => {
    const rangeKey = `${price.quantity_range_start}-${price.quantity_range_end}`;
    if (!ranges.find(r => r.start === price.quantity_range_start && r.end === price.quantity_range_end)) {
      ranges.push({
        start: price.quantity_range_start,
        end: price.quantity_range_end,
        key: rangeKey
      });
    }
    return ranges;
  }, [] as Array<{ start: number; end: number; key: string }>);

  // Get unique color counts
  const colorCounts = [1, 2, 3, 4, 5, 6, 7, 8];

  const startEditing = (quantityRange: string, colorCount: number, currentValue: number) => {
    const cellKey = `${quantityRange}-${colorCount}`;
    setEditingCell(cellKey);
    setEditingValue(currentValue.toString());
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const saveEditing = async (quantityRange: string, colorCount: number, existingId?: string) => {
    const numericValue = parseFloat(editingValue);
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error('Please enter a valid price value');
      return;
    }

    const [start, end] = quantityRange.split('-').map(Number);

    try {
      if (existingId) {
        await updateCategoryPrintPrice({
          id: existingId,
          price_per_item: numericValue,
        });
      } else {
        await createCategoryPrintPrice({
          product_type: productType,
          quantity_range_start: start,
          quantity_range_end: end,
          colors_count: colorCount,
          price_per_item: numericValue,
        });
      }
      toast.success('Category print price updated successfully');
      onSuccess?.();
      setEditingCell(null);
      setEditingValue('');
    } catch (err) {
      toast.error('Failed to update category print price');
    }
  };

  const handleDeleteCustomRule = async (id: string) => {
    try {
      await deleteCategoryPrintPrice(id);
      toast.success('Custom rule removed, now using global pricing');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to remove custom rule');
    }
  };

  const getPriceDisplay = (quantityRange: string, colorCount: number) => {
    const [start, end] = quantityRange.split('-').map(Number);
    
    // Find global price
    const globalPrice = globalPrintPrices.find(
      p => p.quantity_range_start === start && 
           p.quantity_range_end === end && 
           p.colors_count === colorCount
    );

    // Find category-specific price
    const categoryPrice = categoryPrices.find(
      p => p.quantity_range_start === start && 
           p.quantity_range_end === end && 
           p.colors_count === colorCount
    );

    const isCustomized = !!categoryPrice;
    const effectivePrice = categoryPrice ? categoryPrice.price_per_item : globalPrice?.price_per_item || 0;
    const cellKey = `${quantityRange}-${colorCount}`;
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
              min="0"
              className="w-20"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => saveEditing(quantityRange, colorCount, categoryPrice?.id)}
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
            {isCustomized ? 'Custom' : 'New Custom'}
          </Badge>
        </div>
      );
    }

    if (isCustomized) {
      return (
        <div className="space-y-2">
          <div 
            className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-gray-300"
            onClick={() => startEditing(quantityRange, colorCount, effectivePrice)}
          >
            <span className="font-medium">€{effectivePrice.toFixed(2)}</span>
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
          onClick={() => startEditing(quantityRange, colorCount, effectivePrice)}
        >
          <span className="text-gray-500">€{effectivePrice.toFixed(2)}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Global
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Print Prices for {productType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          <p className="text-sm text-gray-600">
            Click on any price to customize it. Custom rules override global pricing for this category.
          </p>
        </div>
        <Button
          variant={editMode ? "default" : "outline"}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Changes" : "Edit Prices"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quantity Range</TableHead>
              {colorCounts.map(colorCount => (
                <TableHead key={colorCount} className="text-center">
                  {colorCount} {colorCount === 1 ? 'Color' : 'Colors'}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {quantityRanges.map((range) => (
              <TableRow key={range.key}>
                <TableCell className="font-medium">
                  {range.start}-{range.end === 9999 ? '∞' : range.end}
                </TableCell>
                {colorCounts.map(colorCount => (
                  <TableCell key={`${range.key}-${colorCount}`} className="text-center">
                    {getPriceDisplay(range.key, colorCount)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editMode && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Custom Rules</h4>
            <div className="space-y-2">
              {categoryPrices.map((price) => (
                <div key={price.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>
                    {price.quantity_range_start}-{price.quantity_range_end === 9999 ? '∞' : price.quantity_range_end} • {price.colors_count} {price.colors_count === 1 ? 'Color' : 'Colors'} • €{price.price_per_item.toFixed(2)}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCustomRule(price.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {categoryPrices.length === 0 && (
                <p className="text-blue-700 text-sm">No custom rules set. Click on any price above to create one.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm text-gray-500">
        <p>
          * Print prices are per item and depend on quantity and number of colors.
        </p>
        <p>
          * <strong>Click on any price to customize it</strong> - this will create a category-specific rule.
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
