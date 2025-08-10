import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSizeMultipliers } from '@/hooks/useSizeMultipliers';
import { X, Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SizeMultipliersManagerProps {
  productId: string;
  sizes: string[];
  onSizesChange?: (newSizes: string[]) => void;
}

export function SizeMultipliersManager({ productId, sizes, onSizesChange }: SizeMultipliersManagerProps) {
  const [newSize, setNewSize] = useState('');
  const [newMultiplier, setNewMultiplier] = useState('');
  const [editingMultipliers, setEditingMultipliers] = useState<Record<string, string>>({});
  
  const {
    sizeMultipliers,
    loading,
    error,
    setSizeMultiplier,
    removeSizeMultiplier,
    updateSizeMultipliers
  } = useSizeMultipliers(productId);

  // Add new size with multiplier
  const handleAddSize = async () => {
    if (!newSize.trim() || !newMultiplier.trim()) {
      toast({
        title: "Error",
        description: "Please enter both size and multiplier",
        variant: "destructive"
      });
      return;
    }

    const multiplier = parseFloat(newMultiplier);
    if (isNaN(multiplier) || multiplier <= 0) {
      toast({
        title: "Error",
        description: "Multiplier must be a positive number",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add to sizes array if it doesn't exist
      if (!sizes.includes(newSize)) {
        const newSizes = [...sizes, newSize];
        onSizesChange?.(newSizes);
      }

      // Add multiplier
      await setSizeMultiplier(newSize, multiplier);
      
      setNewSize('');
      setNewMultiplier('');
      
      toast({
        title: "Success",
        description: `Added size ${newSize} with multiplier ${multiplier}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add size and multiplier",
        variant: "destructive"
      });
    }
  };

  // Start editing a multiplier
  const startEditing = (size: string) => {
    setEditingMultipliers(prev => ({
      ...prev,
      [size]: sizeMultipliers[size]?.toString() || '1.0'
    }));
  };

  // Save edited multiplier
  const saveMultiplier = async (size: string) => {
    const multiplier = parseFloat(editingMultipliers[size]);
    if (isNaN(multiplier) || multiplier <= 0) {
      toast({
        title: "Error",
        description: "Multiplier must be a positive number",
        variant: "destructive"
      });
      return;
    }

    try {
      await setSizeMultiplier(size, multiplier);
      setEditingMultipliers(prev => {
        const newState = { ...prev };
        delete newState[size];
        return newState;
      });
      
      toast({
        title: "Success",
        description: `Updated multiplier for ${size}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update multiplier",
        variant: "destructive"
      });
    }
  };

  // Remove size and its multiplier
  const handleRemoveSize = async (size: string) => {
    try {
      // Remove multiplier
      await removeSizeMultiplier(size);
      
      // Remove from sizes array
      const newSizes = sizes.filter(s => s !== size);
      onSizesChange?.(newSizes);
      
      toast({
        title: "Success",
        description: `Removed size ${size}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove size",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading size multipliers...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Sizes & Multipliers</span>
          <Badge variant="secondary">{sizes.length} sizes</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new size */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-size">Size</Label>
            <Input
              id="new-size"
              placeholder="e.g., 38x42cm"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
          </div>
          <div className="w-24">
            <Label htmlFor="new-multiplier">Multiplier</Label>
            <Input
              id="new-multiplier"
              placeholder="1.0"
              value={newMultiplier}
              onChange={(e) => setNewMultiplier(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddSize}
            className="mt-6"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Existing sizes */}
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center gap-2 p-2 border rounded-lg">
              <span className="flex-1 font-medium">{size}</span>
              
              {editingMultipliers[size] !== undefined ? (
                // Editing mode
                <div className="flex items-center gap-2">
                  <Input
                    value={editingMultipliers[size]}
                    onChange={(e) => setEditingMultipliers(prev => ({
                      ...prev,
                      [size]: e.target.value
                    }))}
                    className="w-20"
                  />
                  <Button
                    onClick={() => saveMultiplier(size)}
                    size="sm"
                    variant="outline"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                // Display mode
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {sizeMultipliers[size] || 1.0}x
                  </Badge>
                  <Button
                    onClick={() => startEditing(size)}
                    size="sm"
                    variant="ghost"
                  >
                    Edit
                  </Button>
                </div>
              )}
              
              <Button
                onClick={() => handleRemoveSize(size)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Help text */}
        <div className="text-sm text-gray-500">
          <p>• Multiplier affects the final price: 1.0 = no change, 1.2 = 20% increase</p>
          <p>• Larger sizes typically have higher multipliers</p>
          <p>• Default multiplier is 1.0 for new sizes</p>
        </div>
      </CardContent>
    </Card>
  );
} 