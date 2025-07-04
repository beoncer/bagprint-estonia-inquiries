
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
      {/* Image skeleton - aspect-square to match real cards */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content section */}
      <div className="p-4 flex-grow">
        {/* Product name - 2 lines */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        
        {/* Description - 3 lines */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        
        {/* Price */}
        <Skeleton className="h-5 w-24" />
      </div>
      
      {/* Footer with buttons */}
      <div className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
