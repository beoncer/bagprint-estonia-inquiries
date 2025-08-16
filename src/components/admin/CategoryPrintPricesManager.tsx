import { useState } from 'react';
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

const COLOR_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8];

export function CategoryPrintPricesManager({ productType, onSuccess }: CategoryPrintPricesManagerProps) {
  const {
    quantityMultipliers: globalMultipliers,
    printPrices: globalPrintPrices,
    categoryPrintPrices,
    updateCategoryPrintPrice,
    createCategoryPrintPrice,
    deleteCategoryPrintPrice,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    rangeStart: number;
    rangeEnd: number;
    colorCount: number;
    priceId?: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Get category-specific print prices for this product type
  const categoryPrices = categoryPrintPrices.filter(p => p.product_type === productType);
  
  // Create a matrix showing both global and category-specific print prices
  const priceMatrix = globalMultipliers.map(range => ({
    range,
    prices: COLOR_COUNTS.map(colorCount => {
      const globalPrice = globalPrintPrices.find(
        p => p.quantity_range_start === range.quantity_range_start &&
             p.quantity_range_end === range.quantity_range_end &&
             p.colors_count === colorCount
      );
      
      const categoryPrice = categoryPrices.find(
        p => p.quantity_range_start === range.quantity_range_start &&
             p.quantity_range_end === range.quantity_range_end &&
             p.colors_count === colorCount
      );
      
      return {
        globalPrice: globalPrice?.price_per_item || 0,
        categoryPrice: categoryPrice?.price_per_item || 0,
        categoryPriceId: categoryPrice?.id,
        isCustomized: !!categoryPrice,
        effectivePrice: categoryPrice ? categoryPrice.price_per_item : (globalPrice?.price_per_item || 0),
      };
    }),
  }));

  const handlePriceChange = async (
    rangeStart: number,
    rangeEnd: number,
    colorCount: number,
    value: string,
    priceId?: string
  ) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) return;

    try {
      if (priceId) {
        await updateCategoryPrintPrice({
          id: priceId,
          price_per_item: numericValue,
        });
      } else {
        await createCategoryPrintPrice({
          product_type: productType,
          quantity_range_start: rangeStart,
          quantity_range_end: rangeEnd,
          colors_count: colorCount,
          price_per_item: numericValue,
        });
      }
      toast.success('Category print price updated successfully');
      setEditingCell(null);
      setEditValue('');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to update category print price');
    }
  };

  const handleDeleteCustomPrice = async (priceId: string) => {
    try {
      await deleteCategoryPrintPrice(priceId);
      toast.success('Custom price removed, now using global pricing');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to remove custom price');
    }
  };

  const startEditing = (rangeStart: number, rangeEnd: number, colorCount: number, currentPrice: number, priceId?: string) => {
    if (!editMode) return;
    
    setEditingCell({ rangeStart, rangeEnd, colorCount, priceId });
    setEditValue(currentPrice.toString());
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getPriceDisplay = (priceInfo: any, rangeStart: number, rangeEnd: number, colorCount: number) => {
    const isEditing = editingCell && 
      editingCell.rangeStart === rangeStart && 
      editingCell.rangeEnd === rangeEnd && 
      editingCell.colorCount === colorCount;

    if (isEditing) {
      return (
        <div className="space-y-2">
          <Input
            type="number"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handlePriceChange(rangeStart, rangeEnd, colorCount, editValue, priceInfo.categoryPriceId);
              } else if (e.key === 'Escape') {
                cancelEditing();
              }
            }}
            onBlur={() => handlePriceChange(rangeStart, rangeEnd, colorCount, editValue, priceInfo.categoryPriceId)}
            step="0.01"
            min="0"
            className="w-20 text-center"
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePriceChange(rangeStart, rangeEnd, colorCount, editValue, priceInfo.categoryPriceId)}
              className="text-xs px-2"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEditing}
              className="text-xs px-2"
            >
              ✕
            </Button>
          </div>
        </div>
      );
    }

    if (priceInfo.isCustomized) {
      return (
        <div className="space-y-2">
          <div 
            className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${editMode ? 'border border-dashed border-gray-300' : ''}`}
            onClick={() => startEditing(rangeStart, rangeEnd, colorCount, priceInfo.effectivePrice, priceInfo.categoryPriceId)}
          >
            <span className="font-medium">€{priceInfo.effectivePrice.toFixed(2)}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Custom
          </Badge>
          {editMode && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteCustomPrice(priceInfo.categoryPriceId!)}
              className="w-full text-xs"
            >
              Remove
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div 
          className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${editMode ? 'border border-dashed border-gray-300' : ''}`}
          onClick={() => startEditing(rangeStart, rangeEnd, colorCount, priceInfo.effectivePrice)}
        >
          <span className="text-gray-500">€{priceInfo.effectivePrice.toFixed(2)}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Global
        </Badge>
      </div>
    );
  };

  const getProductTypeDisplayName = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Print Prices for {getProductTypeDisplayName(productType)}</h3>
          <p className="text-sm text-gray-600">
            Customize print costs for this category. Prices not set will use global pricing.
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
              <TableHead className="min-w-[120px]">Quantity Range</TableHead>
              {COLOR_COUNTS.map(colorCount => (
                <TableHead key={colorCount} className="text-center min-w-[80px]">
                  {colorCount} Color{colorCount > 1 ? 's' : ''}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceMatrix.map(({ range, prices }) => (
              <TableRow key={`${range.quantity_range_start}-${range.quantity_range_end}`}>
                <TableCell className="font-medium min-w-[120px]">
                  {range.quantity_range_start}-{range.quantity_range_end === 9999 ? '∞' : range.quantity_range_end}
                </TableCell>
                {prices.map((priceInfo, index) => (
                  <TableCell key={index} className="text-center min-w-[80px]">
                    {getPriceDisplay(priceInfo, range.quantity_range_start, range.quantity_range_end, COLOR_COUNTS[index])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editMode && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">How to Customize Print Prices</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Click on any price cell</strong> to edit it for this category</p>
            <p>• Custom prices will override global pricing for this category</p>
            <p>• Press Enter to save or Escape to cancel</p>
            <p>• Use the "Remove" button to revert to global pricing</p>
            <p>• Different materials may have different print costs:</p>
            <ul className="ml-4 space-y-1">
              <li>• <strong>Cotton bags:</strong> Higher print costs due to fabric complexity</li>
              <li>• <strong>Paper bags:</strong> Standard print costs</li>
              <li>• <strong>Drawstring bags:</strong> Medium print costs</li>
              <li>• <strong>Shoe bags:</strong> Specialized print requirements</li>
              <li>• <strong>Packaging boxes:</strong> Varies by material type</li>
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm text-gray-500">
        <p>
          * These prices are added per item when printing is requested.
        </p>
        <p>
          * Custom rules override global pricing for this category.
        </p>
        <p>
          * Prices not set will automatically use global pricing.
        </p>
        <p>
          * Consider material complexity when setting category-specific prices.
        </p>
      </div>
    </div>
  );
}
