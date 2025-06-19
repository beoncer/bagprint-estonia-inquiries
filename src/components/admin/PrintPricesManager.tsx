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
import { QUANTITY_RANGES, COLOR_COUNTS } from '@/types/pricing';
import { toast } from 'sonner';

export function PrintPricesManager() {
  const {
    printPrices,
    loading,
    error,
    updatePrintPrice,
    createPrintPrice,
    deletePrintPrice,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);

  // Create a matrix of prices for easier editing
  const priceMatrix = QUANTITY_RANGES.map(range => ({
    range,
    prices: COLOR_COUNTS.map(colorCount => {
      const price = printPrices.find(
        p =>
          p.quantity_range_start === range.start &&
          p.quantity_range_end === range.end &&
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
    if (isNaN(numericValue)) return;

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
      toast.success('Price updated successfully');
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Print Prices</h2>
        <Button
          variant={editMode ? 'default' : 'outline'}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Save' : 'Edit'}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quantity Range</TableHead>
              {COLOR_COUNTS.map(count => (
                <TableHead key={count}>{count} Color{count > 1 ? 's' : ''}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceMatrix.map(({ range, prices }) => (
              <TableRow key={`${range.start}-${range.end}`}>
                <TableCell>
                  {range.start}-{range.end}
                </TableCell>
                {prices.map((price, index) => (
                  <TableCell key={index}>
                    {editMode ? (
                      <Input
                        type="number"
                        value={price.price}
                        onChange={e =>
                          handlePriceChange(
                            range.start,
                            range.end,
                            COLOR_COUNTS[index],
                            e.target.value,
                            price.id
                          )
                        }
                        step="0.01"
                        min="0"
                        className="w-24"
                      />
                    ) : (
                      price.price.toFixed(2)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 