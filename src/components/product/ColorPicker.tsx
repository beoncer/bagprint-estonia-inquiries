
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_COLORS } from '@/lib/constants';

interface ColorPickerProps {
  selectedColor: string | null;
  colors: string[];
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  colors = [], // Default to empty array to prevent undefined
  onColorSelect,
}) => {
  // Filter PRODUCT_COLORS to only show available colors for this product
  const colorOptions = PRODUCT_COLORS.filter(color => 
    colors.includes(color.value)
  );

  if (!colorOptions.length) {
    return null; // Don't render if no colors available
  }

  return (
    <div className="space-y-2">
      <label className="text-gray-600 text-sm">Värv</label>
      <Select value={selectedColor || ""} onValueChange={onColorSelect}>
        <SelectTrigger className="w-full bg-white border-gray-200">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{
                  backgroundColor: selectedColor === 'naturalne' ? '#F5F5DC' :
                    selectedColor === 'punane' ? '#FF0000' :
                    selectedColor === 'must' ? '#000000' :
                    selectedColor === 'valge' ? '#FFFFFF' :
                    selectedColor === 'hall' ? '#808080' :
                    selectedColor === 'roosa' ? '#FFC0CB' :
                    selectedColor === 'lilla' ? '#800080' :
                    selectedColor === 'royal_sinine' ? '#4169E1' :
                    selectedColor === 'taevasinine' ? '#87CEEB' :
                    selectedColor === 'tume_sinine' ? '#000080' :
                    selectedColor === 'hele_roheline' ? '#90EE90' :
                    selectedColor === 'tume_roheline' ? '#006400' :
                    selectedColor === 'kollane' ? '#FFFF00' :
                    selectedColor === 'pehme_kollane' ? '#F0E68C' :
                    selectedColor === 'oranz' ? '#FFA500' :
                    selectedColor === 'granate' ? '#800000' : 'transparent'
                }}
              />
              {PRODUCT_COLORS.find(c => c.value === selectedColor)?.label || selectedColor}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{
                    backgroundColor: color.value === 'naturalne' ? '#F5F5DC' :
                      color.value === 'punane' ? '#FF0000' :
                      color.value === 'must' ? '#000000' :
                      color.value === 'valge' ? '#FFFFFF' :
                      color.value === 'hall' ? '#808080' :
                      color.value === 'roosa' ? '#FFC0CB' :
                      color.value === 'lilla' ? '#800080' :
                      color.value === 'royal_sinine' ? '#4169E1' :
                      color.value === 'taevasinine' ? '#87CEEB' :
                      color.value === 'tume_sinine' ? '#000080' :
                      color.value === 'hele_roheline' ? '#90EE90' :
                      color.value === 'tume_roheline' ? '#006400' :
                      color.value === 'kollane' ? '#FFFF00' :
                      color.value === 'pehme_kollane' ? '#F0E68C' :
                      color.value === 'oranz' ? '#FFA500' :
                      color.value === 'granate' ? '#800000' : 'transparent'
                  }}
                />
                {color.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorPicker;
