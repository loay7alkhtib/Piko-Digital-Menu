import { supabase } from './supabaseClient'
import type { Locale } from './i18n'
import type { Database } from './database'

// Type aliases for cleaner code
type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

type Item = Database['public']['Tables']['items']['Row']
type ItemInsert = Database['public']['Tables']['items']['Insert']
type ItemUpdate = Database['public']['Tables']['items']['Update']

type ItemPrice = Database['public']['Tables']['item_prices']['Row']
type ItemPriceInsert = Database['public']['Tables']['item_prices']['Insert']

type ItemI18n = Database['public']['Tables']['item_i18n']['Row']
type ItemI18nInsert = Database['public']['Tables']['item_i18n']['Insert']

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

// Extended types with relations
export interface CategoryWithI18n extends Category {
  name: string
}

export interface ItemWithDetails extends Item {
  name: string
  description?: string
  min_price_cents: number
  prices: ItemPrice[]
  category_name: string
}

export interface ItemWithI18n extends Item {
  name: string
  description?: string
  prices: ItemPrice[]
}

// ========================================
// CATEGORY QUERIES
// ========================================

export async function getActiveCategories(locale: Locale): Promise<CategoryWithI18n[]> {
  try {
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
      ...(cat as any),
      name: (cat as any).category_i18n?.[0]?.name || (cat as any).slug
    })) || []
  } catch (error) {
    console.error('Unexpected error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<CategoryWithI18n | null> {
  try {
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

    return {
      ...(data as any),
      name: (data as any).category_i18n?.[0]?.name || (data as any).slug
    }
  } catch (error) {
    console.error('Unexpected error fetching category:', error)
    return null
  }
}

export async function createCategory(data: {
  slug: string
  sort_order?: number
  is_active?: boolean
  translations: { locale: Locale; name: string }[]
}): Promise<Category | null> {
  try {
    // Create category
    const { data: category, error: catError } = await (db as any)
      .from('categories')
      .insert({
        slug: data.slug,
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? true
      })
      .select()
      .single()

    if (catError) {
      console.error('Error creating category:', catError)
      return null
    }

    // Create translations
    const translations = data.translations.map(t => ({
      category_id: category.id,
      locale: t.locale,
      name: t.name
    }))

    const { error: transError } = await (db as any)
      .from('category_i18n')
      .insert(translations)

    if (transError) {
      console.error('Error creating category translations:', transError)
      return null
    }

    return category
  } catch (error) {
    console.error('Unexpected error creating category:', error)
    return null
  }
}

// ========================================
// ITEM QUERIES
// ========================================

export async function getItemsByCategory(
  categorySlug: string, 
  locale: Locale
): Promise<ItemWithI18n[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        item_i18n(name, description),
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
      const activePrices = (item as any).item_prices?.filter((price: any) => price.is_active) || []
      const minPrice = activePrices.length > 0 
        ? Math.min(...activePrices.map((price: any) => price.price_cents))
        : 0

      return {
        ...(item as any),
        name: (item as any).item_i18n?.[0]?.name || 'Untitled',
        description: (item as any).item_i18n?.[0]?.description,
        min_price_cents: minPrice,
        prices: activePrices.sort((a: any, b: any) => a.sort_order - b.sort_order)
      }
    }) || []
  } catch (error) {
    console.error('Unexpected error fetching items:', error)
    return []
  }
}

export async function getItemById(
  itemId: string, 
  locale: Locale
): Promise<ItemWithDetails | null> {
  try {
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

    const activePrices = (data as any).item_prices?.filter((price: any) => price.is_active) || []

    return {
      ...(data as any),
      name: (data as any).item_i18n?.[0]?.name || 'Untitled',
      description: (data as any).item_i18n?.[0]?.description,
      prices: activePrices.sort((a: any, b: any) => a.sort_order - b.sort_order),
      category_name: (data as any).categories?.category_i18n?.[0]?.name || 'Unknown',
      min_price_cents: activePrices.length > 0 
        ? Math.min(...activePrices.map((price: any) => price.price_cents))
        : 0
    }
  } catch (error) {
    console.error('Unexpected error fetching item:', error)
    return null
  }
}

export async function createItem(data: {
  category_id: string
  image_url?: string
  sort_order?: number
  is_active?: boolean
  translations: { locale: Locale; name: string; description?: string }[]
  prices: { size_name: string; price_cents: number; sort_order?: number }[]
}): Promise<Item | null> {
  try {
    // Create item
    const { data: item, error: itemError } = await (db as any)
      .from('items')
      .insert({
        category_id: data.category_id,
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0,
        is_active: data.is_active ?? false
      })
      .select()
      .single()

    if (itemError) {
      console.error('Error creating item:', itemError)
      return null
    }

    // Create translations
    const translations = data.translations.map(t => ({
      item_id: item.id,
      locale: t.locale,
      name: t.name,
      description: t.description || null
    }))

    const { error: transError } = await (db as any)
      .from('item_i18n')
      .insert(translations)

    if (transError) {
      console.error('Error creating item translations:', transError)
      return null
    }

    // Create prices
    const prices = data.prices.map((p, index) => ({
      item_id: item.id,
      size_name: p.size_name,
      price_cents: p.price_cents,
      sort_order: p.sort_order ?? index
    }))

    const { error: pricesError } = await (db as any)
      .from('item_prices')
      .insert(prices)

    if (pricesError) {
      console.error('Error creating item prices:', pricesError)
      return null
    }

    return item
  } catch (error) {
    console.error('Unexpected error creating item:', error)
    return null
  }
}

export async function updateItem(
  itemId: string,
  data: {
    category_id?: string
    image_url?: string
    sort_order?: number
    is_active?: boolean
    translations?: { locale: Locale; name: string; description?: string }[]
    prices?: { size_name: string; price_cents: number; sort_order?: number }[]
  }
): Promise<boolean> {
  try {
    // Update item
    const { error: itemError } = await (db as any)
      .from('items')
      .update({
        category_id: data.category_id,
        image_url: data.image_url,
        sort_order: data.sort_order,
        is_active: data.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)

    if (itemError) {
      console.error('Error updating item:', itemError)
      return false
    }

    // Update translations if provided
    if (data.translations) {
      // Delete existing translations
      await (db as any)
        .from('item_i18n')
        .delete()
        .eq('item_id', itemId)

      // Insert new translations
      const translations = data.translations.map(t => ({
        item_id: itemId,
        locale: t.locale,
        name: t.name,
        description: t.description || null
      }))

      const { error: transError } = await (db as any)
        .from('item_i18n')
        .insert(translations)

      if (transError) {
        console.error('Error updating item translations:', transError)
        return false
      }
    }

    // Update prices if provided
    if (data.prices) {
      // Delete existing prices
      await (db as any)
        .from('item_prices')
        .delete()
        .eq('item_id', itemId)

      // Insert new prices
      const prices = data.prices.map((p, index) => ({
        item_id: itemId,
        size_name: p.size_name,
        price_cents: p.price_cents,
        sort_order: p.sort_order ?? index
      }))

      const { error: pricesError } = await (db as any)
        .from('item_prices')
        .insert(prices)

      if (pricesError) {
        console.error('Error updating item prices:', pricesError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating item:', error)
    return false
  }
}

export async function deleteItem(itemId: string): Promise<boolean> {
  try {
    const { error } = await (db as any)
      .from('items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error deleting item:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error deleting item:', error)
    return false
  }
}

// ========================================
// ADMIN QUERIES
// ========================================

export async function getAllItemsForAdmin(locale: Locale = 'en'): Promise<ItemWithI18n[]> {
  try {
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
      .eq('item_i18n.locale', locale)
      .eq('categories.category_i18n.locale', locale)
      .order('sort_order')

    if (error) {
      console.error('Error fetching items for admin:', error)
      return []
    }

    return data?.map(item => ({
      ...(item as any),
      name: (item as any).item_i18n?.[0]?.name || 'Untitled',
      description: (item as any).item_i18n?.[0]?.description,
      prices: (item as any).item_prices?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    })) || []
  } catch (error) {
    console.error('Unexpected error fetching items for admin:', error)
    return []
  }
}

// ========================================
// PROFILE QUERIES
// ========================================

export async function createProfile(data: ProfileInsert): Promise<Profile | null> {
  try {
    const { data: profile, error } = await (db as any)
      .from('profiles')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Unexpected error creating profile:', error)
    return null
  }
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return null
  }
}

export async function updateProfileRole(userId: string, role: 'customer' | 'staff' | 'admin'): Promise<boolean> {
  try {
    const { error } = await (db as any)
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating profile role:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating profile role:', error)
    return false
  }
}
