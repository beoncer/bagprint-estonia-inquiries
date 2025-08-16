
import { PrintPricesManager } from '@/components/admin/PrintPricesManager';
import { QuantityMultipliersManager } from '@/components/admin/QuantityMultipliersManager';
import { CategoryPricingManager } from '@/components/admin/CategoryPricingManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPricingPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Pricing Management</h1>
      
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Global Pricing</TabsTrigger>
          <TabsTrigger value="category">Category-Specific Pricing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Global Pricing Rules</h2>
            <p className="text-gray-600 mb-6">
              These pricing rules apply to all products by default. Category-specific rules can override these when configured.
            </p>
            <QuantityMultipliersManager />
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <PrintPricesManager />
          </div>
        </TabsContent>
        
        <TabsContent value="category" className="space-y-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <CategoryPricingManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
