import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Product } from "@/lib/supabase";
import { PRODUCT_COLORS } from "@/lib/constants";
import { ProductBadge } from "./ProductBadge";
import { BadgeType } from "@/lib/badge-constants";

interface ProductTechnicalDetailsProps {
  product: Product;
}

const ProductTechnicalDetails: React.FC<ProductTechnicalDetailsProps> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getColorLabel = (colorValue: string) => {
    const color = PRODUCT_COLORS.find(c => c.value === colorValue);
    return color ? color.label : colorValue;
  };

  const hasDetails = product.material || 
                    (product.sizes && product.sizes.length > 0) || 
                    (product.colors && product.colors.length > 0) || 
                    (product.badges && product.badges.length > 0);

  if (!hasDetails) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Tehnilised andmed
        </h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {product.material && (
            <div className="flex items-start">
              <span className="font-medium text-gray-700 min-w-[100px]">Materjal:</span>
              <span className="text-gray-600">{product.material}</span>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-start">
              <span className="font-medium text-gray-700 min-w-[100px]">Suurused:</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="bg-white px-2 py-1 rounded text-sm border"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-start">
              <span className="font-medium text-gray-700 min-w-[100px]">Värvid:</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="bg-white px-2 py-1 rounded text-sm border"
                  >
                    {getColorLabel(color)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.badges && product.badges.length > 0 && (
            <div className="flex items-start">
              <span className="font-medium text-gray-700 min-w-[100px]">Märgised:</span>
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <ProductBadge key={index} type={badge as BadgeType} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTechnicalDetails;
