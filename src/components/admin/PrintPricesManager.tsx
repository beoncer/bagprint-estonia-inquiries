
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
import { usePricing } from '@/hooks/usePricing';
import { toast } from 'sonner';

const COLOR_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8];

export function PrintPricesManager() {
  const {
    printPrices,
    quantityMultipliers,
    loading,
    error,
    updatePrintPrice,
    createPrintPrice,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);

  // Create a matrix of prices for easier editing
  const priceMatrix = quantityMultipliers.map(range => ({
    range,
    prices: COLOR_COUNTS.map(colorCount => {
      const price = printPrices.find(
        p =>
          p.quantity_range_start === range.quantity_range_start &&
          p.quantity_range_end === range.quantity_range_end &&
          p.colors_count === colorCount
      );
      return {
        id: price?.id,
        price: price?.price_per_item || 0,
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
        await updatePrintPrice({
          id: priceId,
          price_per_item: numericValue,
        });
      } else {
        await createPrintPrice({
          quantity_range_start: rangeStart,
          quantity_range_end: rangeEnd,
          colors_count: colorCount,
          price_per_item: numericValue,
        });
      }
      toast.success('Print price updated successfully');
    } catch (err) {
      toast.error('Failed to update print price');
    }
  };

  if (loading) return <div>Loading print prices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Print Prices (Per Item)</h2>
        <Button
          variant={editMode ? 'default' : 'outline'}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Save Changes' : 'Edit Prices'}
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Quantity Range</TableHead>
              {COLOR_COUNTS.map(count => (
                <TableHead key={count} className="text-center min-w-[80px]">
                  {count} Color{count > 1 ? 's' : ''}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceMatrix.map(({ range, prices }) => (
              <TableRow key={`${range.quantity_range_start}-${range.quantity_range_end}`}>
                <TableCell className="font-medium">
                  {range.quantity_range_start}-{range.quantity_range_end === 9999 ? '∞' : range.quantity_range_end}
                </TableCell>
                {prices.map((price, index) => (
                  <TableCell key={index} className="text-center">
                    {editMode ? (
                      <Input
                        type="number"
                        value={price.price}
                        onChange={e =>
                          handlePriceChange(
                            range.quantity_range_start,
                            range.quantity_range_end,
                            COLOR_COUNTS[index],
                            e.target.value,
                            price.id
                          )
                        }
                        step="0.01"
                        min="0"
                        className="w-20 text-center"
                      />
                    ) : (
                      `€${price.price.toFixed(2)}`
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-500">
        * These prices are added per item when printing is requested. Lower quantities generally have higher per-item print costs.
      </p>
    </div>
  );
}
