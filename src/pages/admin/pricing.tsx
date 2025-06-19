import { PrintPricesManager } from '@/components/admin/PrintPricesManager';
import { QuantityMultipliersManager } from '@/components/admin/QuantityMultipliersManager';

export default function AdminPricingPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Pricing Management</h1>
      
      <div className="grid gap-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <PrintPricesManager />
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <QuantityMultipliersManager />
        </div>
      </div>
    </div>
  );
} 