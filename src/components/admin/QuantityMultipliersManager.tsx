
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

export function QuantityMultipliersManager() {
  const {
    quantityMultipliers,
    loading,
    error,
    updateQuantityMultiplier,
  } = usePricing();

  const [editMode, setEditMode] = useState(false);

  const handleMultiplierChange = async (id: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) return;

    try {
      await updateQuantityMultiplier({
        id,
        multiplier: numericValue,
      });
      toast.success('Multiplier updated successfully');
    } catch (err) {
      toast.error('Failed to update multiplier');
    }
  };

  if (loading) return <div>Loading multipliers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quantity Multipliers (Bulk Discounts)</h2>
        <Button
          variant={editMode ? 'default' : 'outline'}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Save Changes' : 'Edit Multipliers'}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quantity Range</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Example (€10 base price)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quantityMultipliers.map((multiplier) => {
              const discountPercent = Math.round((1 - multiplier.multiplier) * 100);
              const examplePrice = (10 * multiplier.multiplier).toFixed(2);
              
              return (
                <TableRow key={multiplier.id}>
                  <TableCell>
                    {multiplier.quantity_range_start}-{multiplier.quantity_range_end === 9999 ? '∞' : multiplier.quantity_range_end}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="number"
                        value={multiplier.multiplier}
                        onChange={e => handleMultiplierChange(multiplier.id, e.target.value)}
                        step="0.01"
                        min="0.1"
                        max="1"
                        className="w-24"
                      />
                    ) : (
                      multiplier.multiplier.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={discountPercent > 0 ? 'text-green-600' : ''}>
                      {discountPercent > 0 ? `-${discountPercent}%` : 'No discount'}
                    </span>
                  </TableCell>
                  <TableCell>€{examplePrice}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-500">
        * Multipliers are applied to the base price. Lower multiplier = bigger discount.
      </p>
    </div>
  );
}
