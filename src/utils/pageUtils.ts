
import { supabase } from "@/integrations/supabase/client";

// Function to get all pages from the database
export const fetchPages = async () => {
  try {
    // Get unique pages from website_content table
    const { data: contentPagesData, error: contentError } = await supabase
      .from("website_content")
      .select("page");
    
    // Get unique pages from seo_metadata table
    const { data: seoPagesData, error: seoError } = await supabase
      .from("seo_metadata")
      .select("page");
    
    if (contentError) throw contentError;
    if (seoError) throw seoError;
    
    // Extract page values and remove duplicates manually
    const contentPages = contentPagesData?.map(item => item.page) || [];
    const seoPages = seoPagesData?.map(item => item.page) || [];
    
    // Combine and deduplicate pages
    const allPages = [
      ...contentPages,
      ...seoPages
    ];
    
    // Define standard pages based on App.tsx routes
    const standardPages = [
      "home", 
      "products", 
      "contact", 
      "about", 
      "inquiry", 
      "product-detail"
    ];
    
    // Create a set of unique pages
    const uniquePages = Array.from(new Set([...allPages, ...standardPages])).sort();
    
    // Format options for dropdown
    return uniquePages.map(page => ({
      value: page,
      label: page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')
    }));
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
};
