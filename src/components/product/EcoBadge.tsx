import React from 'react';
import { Leaf } from 'lucide-react';

const EcoBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#4CAF50] bg-[#4CAF50]/10">
      <div className="w-6 h-6 rounded-md bg-[#4CAF50] flex items-center justify-center">
        <Leaf className="w-4 h-4 text-white" />
      </div>
      <span className="font-medium text-[#4CAF50]">Öko toode</span>
    </div>
  );
};

export default EcoBadge; 