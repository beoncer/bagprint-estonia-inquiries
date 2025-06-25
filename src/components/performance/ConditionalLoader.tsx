
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Conditional component loader to reduce unused JS
const ConditionalLoader = ({ 
  condition, 
  component: Component, 
  fallback = <LoadingSpinner />,
  ...props 
}: {
  condition: boolean;
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) => {
  if (!condition) return null;
  
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export default ConditionalLoader;
