import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePricing } from '@/hooks/usePricing';
import { CategoryQuantityMultipliersManager } from './CategoryQuantityMultipliersManager';
import { CategoryPrintPricesManager } from './CategoryPrintPricesManager';
import { toast } from 'sonner';

const PRODUCT_TYPES = [
  { value: 'cotton_bag', label: 'Cotton Bags', description: 'Fabric bags with custom printing' },
  { value: 'paper_bag', label: 'Paper Bags', description: 'Eco-friendly paper bags' },
  { value: 'drawstring_bag', label: 'Drawstring Bags', description: 'String-tied fabric bags' },
  { value: 'shoebag', label: 'Shoe Bags', description: 'Specialized shoe storage bags' },
  { value: 'packaging_box', label: 'Packaging Boxes', description: 'Custom printed boxes' },
];

export function CategoryPricingManager() {
  const {
    categoryQuantityMultipliers,
    categoryPrintPrices,
    getCategoryPricingConfig,
    getAvailableProductTypes,
    loading,
    error,
  } = usePricing();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryPricing, setShowCategoryPricing] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryPricing(true);
  };

  const getCategoryStatus = (productType: string) => {
    const config = getCategoryPricingConfig(productType);
    if (config.isActive) {
      const hasMultipliers = config.quantityMultipliers.length > 0;
      const hasPrintPrices = config.printPrices.length > 0;
      
      if (hasMultipliers && hasPrintPrices) {
        return { status: 'complete', label: 'Complete', color: 'bg-green-100 text-green-800' };
      } else if (hasMultipliers || hasPrintPrices) {
        return { status: 'partial', label: 'Partial', color: 'bg-yellow-100 text-yellow-800' };
      }
    }
    return { status: 'none', label: 'Global Only', color: 'bg-gray-100 text-gray-800' };
  };

  const getCategoryStats = (productType: string) => {
    const config = getCategoryPricingConfig(productType);
    const multiplierCount = config.quantityMultipliers.length;
    const printPriceCount = config.printPrices.length;
    
    return { multiplierCount, printPriceCount };
  };

  if (loading) return <div>Loading category pricing...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Category-Specific Pricing</h2>
          <p className="text-gray-600">
            Set different pricing rules for each product category. Categories without specific rules will use global pricing.
          </p>
        </div>
      </div>

      {!showCategoryPricing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCT_TYPES.map((productType) => {
            const status = getCategoryStatus(productType.value);
            const stats = getCategoryStats(productType.value);
            
            return (
              <Card 
                key={productType.value} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategorySelect(productType.value)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{productType.label}</CardTitle>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                  <CardDescription>{productType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quantity Multipliers:</span>
                      <span className="font-medium">{stats.multiplierCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Print Prices:</span>
                      <span className="font-medium">{stats.printPriceCount}</span>
                    </div>
                  </div>
                  
                  {status.status === 'none' && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700 text-xs">
                      Uses global pricing rules
                    </div>
                  )}
                  
                  {status.status === 'partial' && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-yellow-700 text-xs">
                      Some rules configured, others use global
                    </div>
                  )}
                  
                  {status.status === 'complete' && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-green-700 text-xs">
                      Fully configured with category-specific rules
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCategoryPricing(false)}
              >
                ← Back to Categories
              </Button>
              <div>
                <h3 className="text-xl font-semibold">
                  {PRODUCT_TYPES.find(p => p.value === selectedCategory)?.label} Pricing
                </h3>
                <p className="text-sm text-gray-600">
                  Configure pricing rules specific to this category
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Category:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((productType) => (
                    <SelectItem key={productType.value} value={productType.value}>
                      {productType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quantity Multipliers (Bulk Discounts)</CardTitle>
                <CardDescription>
                  Set category-specific bulk discount rates. If no rules are set, global pricing will be used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryQuantityMultipliersManager 
                  productType={selectedCategory}
                  onSuccess={() => toast.success('Category multipliers updated successfully')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Print Prices (Per Item)</CardTitle>
                <CardDescription>
                  Set category-specific print costs. If no rules are set, global pricing will be used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryPrintPricesManager 
                  productType={selectedCategory}
                  onSuccess={() => toast.success('Category print prices updated successfully')}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
