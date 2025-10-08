import { supabase } from './supabaseClient'
import type { Locale } from './i18n'

// Database Types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      category_i18n: {
        Row: {
          id: string
          category_id: string
          locale: Locale
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          locale: Locale
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          locale?: Locale
          name?: string
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          category_id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      item_i18n: {
        Row: {
          id: string
          item_id: string
          locale: Locale
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          locale: Locale
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          locale?: Locale
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      item_prices: {
        Row: {
          id: string
          item_id: string
          size_name: string
          price_cents: number
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          size_name: string
          price_cents: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          size_name?: string
          price_cents?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'customer' | 'staff' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'customer' | 'staff' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'customer' | 'staff' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Create typed Supabase client
export const createTypedSupabaseClient = () => {
  return supabase as any as import('@supabase/supabase-js').SupabaseClient<Database>
}

// Export the typed client
export const db = createTypedSupabaseClient()
