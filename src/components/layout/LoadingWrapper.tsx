
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

const LoadingWrapper = ({ children }: LoadingWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Short delay to ensure CSS is loaded

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 50); // Very short delay for route transitions

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading || isNavigating) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;
