export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          read_time: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_blog_posts: {
        Row: {
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          read_time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_content: {
        Row: {
          created_at: string | null
          id: string
          key: string
          order: number | null
          section: string
          value: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          order?: number | null
          section: string
          value: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          order?: number | null
          section?: string
          value?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      guarantees: {
        Row: {
          created_at: string | null
          description: string
          id: number
          order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
          url_et: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
          url_et: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
          url_et?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      popular_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "popular_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          order: number | null
          tags: string | null
          title: string
          visible: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          order?: number | null
          tags?: string | null
          title: string
          visible?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          order?: number | null
          tags?: string | null
          title?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      print_prices: {
        Row: {
          colors_count: number
          created_at: string
          id: string
          price_per_item: number
          quantity_range_end: number
          quantity_range_start: number
          updated_at: string
        }
        Insert: {
          colors_count: number
          created_at?: string
          id?: string
          price_per_item: number
          quantity_range_end: number
          quantity_range_start: number
          updated_at?: string
        }
        Update: {
          colors_count?: number
          created_at?: string
          id?: string
          price_per_item?: number
          quantity_range_end?: number
          quantity_range_start?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_sizes: {
        Row: {
          created_at: string | null
          id: string
          size_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          size_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          size_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_images: string[] | null
          badges: string[] | null
          base_price: number
          color_images: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_eco: boolean | null
          main_color: string | null
          material: string | null
          model: string | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          size_images: Json | null
          sizes: string[] | null
          slug: string | null
          type: string
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          badges?: string[] | null
          base_price?: number
          color_images?: Json | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_eco?: boolean | null
          main_color?: string | null
          material?: string | null
          model?: string | null
          name: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          size_images?: Json | null
          sizes?: string[] | null
          slug?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          badges?: string[] | null
          base_price?: number
          color_images?: Json | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_eco?: boolean | null
          main_color?: string | null
          material?: string | null
          model?: string | null
          name?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          size_images?: Json | null
          sizes?: string[] | null
          slug?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      quantity_multipliers: {
        Row: {
          created_at: string
          id: string
          multiplier: number
          quantity_range_end: number
          quantity_range_start: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          multiplier: number
          quantity_range_end: number
          quantity_range_start: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          multiplier?: number
          quantity_range_end?: number
          quantity_range_start?: number
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          created_at: string
          description: string | null
          id: string
          keywords: string | null
          page: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          page: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          page?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_assets: {
        Row: {
          created_at: string
          id: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      sitemap_entries: {
        Row: {
          changefreq: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_dynamic: boolean | null
          lastmod: string | null
          priority: number | null
          source_id: string | null
          source_table: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          changefreq?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          lastmod?: string | null
          priority?: number | null
          source_id?: string | null
          source_table?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          changefreq?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          lastmod?: string | null
          priority?: number | null
          source_id?: string | null
          source_table?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          created_at: string
          id: string
          key: string
          link: string | null
          page: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          link?: string | null
          page: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          link?: string | null
          page?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_product_size: {
        Args: { size_value: string }
        Returns: string
      }
      generate_sitemap_xml: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      search_products_by_colors: {
        Args: { search_colors: string[] }
        Returns: {
          additional_images: string[] | null
          badges: string[] | null
          base_price: number
          color_images: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_eco: boolean | null
          main_color: string | null
          material: string | null
          model: string | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          size_images: Json | null
          sizes: string[] | null
          slug: string | null
          type: string
          updated_at: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sync_dynamic_sitemap_entries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      toggle_eco_status: {
        Args: { product_id: string; new_status: boolean }
        Returns: {
          additional_images: string[] | null
          badges: string[] | null
          base_price: number
          color_images: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_eco: boolean | null
          main_color: string | null
          material: string | null
          model: string | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          size_images: Json | null
          sizes: string[] | null
          slug: string | null
          type: string
          updated_at: string
        }
      }
      update_product_badges: {
        Args: { product_id: string; new_badges: string[] }
        Returns: {
          additional_images: string[] | null
          badges: string[] | null
          base_price: number
          color_images: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_eco: boolean | null
          main_color: string | null
          material: string | null
          model: string | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          size_images: Json | null
          sizes: string[] | null
          slug: string | null
          type: string
          updated_at: string
        }
      }
      update_product_colors: {
        Args: { product_id: string; new_colors: string[] }
        Returns: {
          additional_images: string[] | null
          badges: string[] | null
          base_price: number
          color_images: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_eco: boolean | null
          main_color: string | null
          material: string | null
          model: string | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          size_images: Json | null
          sizes: string[] | null
          slug: string | null
          type: string
          updated_at: string
        }
      }
    }
    Enums: {
      badge_type: "eco" | "organic" | "reusable" | "recycled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_type: ["eco", "organic", "reusable", "recycled"],
    },
  },
} as const
