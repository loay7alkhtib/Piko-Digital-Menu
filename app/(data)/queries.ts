import { supabase } from '@/lib/supabaseClient'
import type { Locale } from '@/lib/i18n'

// Database types (matching your schema)
export interface Category {
  id: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  category_id: string
  image_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ItemPrice {
  id: string
  item_id: string
  size_name: string
  price_cents: number
  is_active: boolean
  sort_order: number
}

export interface ItemI18n {
  id: string
  item_id: string
  locale: Locale
  name: string
  description?: string
}

export interface CategoryI18n {
  id: string
  category_id: string
  locale: Locale
  name: string
}

// Query functions
export async function getActiveCategories(locale: Locale): Promise<(Category & { name: string })[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      category_i18n(name)
    `)
    .eq('is_active', true)
    .eq('category_i18n.locale', locale)
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data?.map(cat => ({
    ...cat,
    name: cat.category_i18n[0]?.name || cat.slug
  })) || []
}

export async function getItemsByCategory(
  categorySlug: string, 
  locale: Locale
): Promise<(Item & { name: string; min_price_cents: number })[]> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      item_i18n(name),
      item_prices(price_cents, is_active),
      categories(slug)
    `)
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .eq('item_i18n.locale', locale)
    .order('sort_order')

  if (error) {
    console.error('Error fetching items:', error)
    return []
  }

      return data?.map(item => {
        const activePrices = item.item_prices?.filter((price: { price_cents: number; is_active: boolean }) => price.is_active) || []
        const minPrice = activePrices.length > 0 
          ? Math.min(...activePrices.map((price: { price_cents: number }) => price.price_cents))
          : 0

    return {
      ...item,
      name: item.item_i18n[0]?.name || 'Untitled',
      min_price_cents: minPrice
    }
  }) || []
}

export async function getItemById(
  itemId: string, 
  locale: Locale
): Promise<(Item & { 
  name: string; 
  description?: string;
  prices: ItemPrice[];
  category_name: string;
}) | null> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      item_i18n(name, description),
      item_prices(*),
      categories(
        category_i18n(name)
      )
    `)
    .eq('id', itemId)
    .eq('item_i18n.locale', locale)
    .eq('categories.category_i18n.locale', locale)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  if (!data) return null

      const activePrices = data.item_prices?.filter((price: { is_active: boolean }) => price.is_active) || []

  return {
    ...data,
    name: data.item_i18n[0]?.name || 'Untitled',
    description: data.item_i18n[0]?.description,
    prices: activePrices.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    category_name: data.categories.category_i18n[0]?.name || 'Unknown'
  }
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<(Category & { name: string }) | null> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      category_i18n(name)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('category_i18n.locale', locale)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  if (!data) return null

  return {
    ...data,
    name: data.category_i18n[0]?.name || data.slug
  }
}
