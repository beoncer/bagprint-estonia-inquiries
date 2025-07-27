import { Product } from "@/lib/supabase";

/**
 * Enhanced product filtering function that searches across all product technical details
 * @param products - Array of products to filter
 * @param searchTerm - Search term to filter by
 * @param category - Category to filter by (optional)
 * @returns Filtered array of products
 */
export const filterProducts = (products: Product[], searchTerm: string, category?: string): Product[] => {
  let result = [...products];
  
  // Apply category filter
  if (category && category !== "all") {
    result = result.filter(product => product.category === category);
  }
  
  // Apply enhanced search filter
  if (searchTerm.trim() !== "") {
    const searchLower = searchTerm.toLowerCase();
    
    result = result.filter(product => {
      // Search in name and description (existing functionality)
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description.toLowerCase().includes(searchLower);
      
      // Search in material (Materjal)
      const materialMatch = product.material?.toLowerCase().includes(searchLower) || false;
      
      // Search in colors array (Värvid)
      const colorsMatch = product.colors?.some(color => 
        color.toLowerCase().includes(searchLower)
      ) || false;
      
      // Search in sizes array (Suurused)
      const sizesMatch = product.sizes?.some(size => 
        size.toLowerCase().includes(searchLower)
      ) || false;
      
      // Search in badges array (Märgised)
      const badgesMatch = product.badges?.some(badge => 
        badge.toLowerCase().includes(searchLower)
      ) || false;
      
      // Search in model
      const modelMatch = product.model?.toLowerCase().includes(searchLower) || false;
      
      // Search in SEO keywords
      const seoKeywordsMatch = product.seo_keywords?.toLowerCase().includes(searchLower) || false;
      
      return nameMatch || descriptionMatch || materialMatch || colorsMatch || sizesMatch || badgesMatch || modelMatch || seoKeywordsMatch;
    });
  }
  
  return result;
};

/**
 * Get search suggestions based on product data
 * @param products - Array of products to generate suggestions from
 * @returns Array of search suggestions
 */
export const getSearchSuggestions = (products: Product[]): Array<{id: string, text: string, category?: string}> => {
  const suggestions: Array<{id: string, text: string, category?: string}> = [];
  
  // Add material suggestions
  const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
  materials.forEach(material => {
    suggestions.push({
      id: `material-${material}`,
      text: material,
      category: 'Materjal'
    });
  });
  
  // Add color suggestions
  const colors = [...new Set(products.flatMap(p => p.colors || []))];
  colors.forEach(color => {
    suggestions.push({
      id: `color-${color}`,
      text: color,
      category: 'Värv'
    });
  });
  
  // Add size suggestions
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
  sizes.forEach(size => {
    suggestions.push({
      id: `size-${size}`,
      text: size,
      category: 'Suurus'
    });
  });
  
  // Add badge suggestions
  const badges = [...new Set(products.flatMap(p => p.badges || []))];
  badges.forEach(badge => {
    suggestions.push({
      id: `badge-${badge}`,
      text: badge,
      category: 'Märgis'
    });
  });
  
  return suggestions;
};
