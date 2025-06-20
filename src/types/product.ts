
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
  is_eco: boolean;
  badges: BadgeType[];
  category: string;
  is_popular: boolean;
} 
