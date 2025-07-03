
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const useBreadcrumbs = () => {
  const location = useLocation();
  
  const addBreadcrumbsToPage = (customItems?: BreadcrumbItem[]) => {
    // This hook can be extended in the future for more complex breadcrumb logic
    return customItems || [];
  };
  
  return { addBreadcrumbsToPage, currentPath: location.pathname };
};
