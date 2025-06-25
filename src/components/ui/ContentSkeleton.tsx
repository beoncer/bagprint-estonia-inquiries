
import { Skeleton } from "@/components/ui/skeleton";

interface ContentSkeletonProps {
  lines?: number;
  showHeader?: boolean;
  showImage?: boolean;
  className?: string;
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ 
  lines = 3, 
  showHeader = true, 
  showImage = false,
  className = ""
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && <Skeleton className="h-48 w-full mb-4 rounded-lg" />}
      {showHeader && <Skeleton className="h-8 w-3/4 mb-4" />}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default ContentSkeleton;
