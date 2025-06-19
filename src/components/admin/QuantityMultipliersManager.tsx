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
import { QUANTITY_RANGES } from '@/types/pricing';
import { toast } from 'sonner';

export function QuantityMultipliersManager() {
  const {
    quantityMultipliers,
    loading,
    error,
    updateQuantityMultiplier,
    createQuantityMultiplier,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);

  // Prepare data for display
  const multiplierRows = QUANTITY_RANGES.map(range => {
    const multiplier = quantityMultipliers.find(
      m =>
        m.quantity_range_start === range.start &&
        m.quantity_range_end === range.end
    );
    return {
      range,
      id: multiplier?.id,
      multiplier: multiplier?.multiplier || 1,
    };
  });

  const handleMultiplierChange = async (
    rangeStart: number,
    rangeEnd: number,
    value: string,
    multiplierId?: string
  ) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    try {
      if (multiplierId) {
        await updateQuantityMultiplier({
          id: multiplierId,
          multiplier: numericValue,
        });
      } else {
        await createQuantityMultiplier({
          quantity_range_start: rangeStart,
          quantity_range_end: rangeEnd,
          multiplier: numericValue,
        });
      }
      toast.success('Multiplier updated successfully');
    } catch (err) {
      toast.error('Failed to update multiplier');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quantity Multipliers</h2>
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
              <TableHead>Multiplier</TableHead>
              <TableHead>Example (€1 base price)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {multiplierRows.map(({ range, id, multiplier }) => (
              <TableRow key={`${range.start}-${range.end}`}>
                <TableCell>
                  {range.start}-{range.end}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      type="number"
                      value={multiplier}
                      onChange={e =>
                        handleMultiplierChange(
                          range.start,
                          range.end,
                          e.target.value,
                          id
                        )
                      }
                      step="0.01"
                      min="0"
                      className="w-24"
                    />
                  ) : (
                    multiplier.toFixed(2)
                  )}
                </TableCell>
                <TableCell>€{(1 * multiplier).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-500">
        * Multipliers are applied to the base price of products without printing
      </p>
    </div>
  );
} 