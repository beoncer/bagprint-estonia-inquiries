
import { BadgeType } from "@/lib/badge-constants";
import { ProductColor } from "@/lib/constants";

export interface Product {
  id: string;
  type: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image: string;
  base_price: number;
  slug: string | null;
  created_at: string;
  updated_at: string;
  colors: ProductColor[];
  sizes: string[];
  is_eco?: boolean;
  badges: BadgeType[];
  category: string;
  is_popular?: boolean;
  material?: string | null;
  color_images?: Record<string, string>;
  size_images?: Record<string, string>;
  additional_images?: string[];
  main_color?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}
