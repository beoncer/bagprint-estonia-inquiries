export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          type: string
          description: string | null
          image_url: string | null
          pricing_without_print: Json
          pricing_with_print: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          description?: string | null
          image_url?: string | null
          pricing_without_print?: Json
          pricing_with_print?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string | null
          image_url?: string | null
          pricing_without_print?: Json
          pricing_with_print?: Json
          created_at?: string
          updated_at?: string
        }
      }
      website_content: {
        Row: {
          id: string
          key: string
          value: string
          page: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          page: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          page?: string
          created_at?: string
          updated_at?: string
        }
      }
      seo_metadata: {
        Row: {
          id: string
          page: string
          title: string
          description: string
          keywords: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page: string
          title: string
          description: string
          keywords: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page?: string
          title?: string
          description?: string
          keywords?: string
          created_at?: string
          updated_at?: string
        }
      }
      site_assets: {
        Row: {
          id: string
          type: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          url?: string
          created_at?: string
        }
      }
    }
  }
} 