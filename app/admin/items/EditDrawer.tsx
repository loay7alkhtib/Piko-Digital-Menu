'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import type { Item } from '@/app/(data)/queries'

interface EditDrawerProps {
  item: Item | null
  onClose: () => void
  onSave: () => void
}

interface ItemFormData {
  name_en: string
  name_ar: string
  name_tr: string
  description_en: string
  description_ar: string
  description_tr: string
  category_id: string
  sort_order: number
  is_active: boolean
  image_file: File | null
  prices: Array<{
    size_name: string
    price_cents: number
    is_active: boolean
    sort_order: number
  }>
}

export default function EditDrawer({ item, onClose, onSave }: EditDrawerProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name_en: '',
    name_ar: '',
    name_tr: '',
    description_en: '',
    description_ar: '',
    description_tr: '',
    category_id: '',
    sort_order: 0,
    is_active: false,
    image_file: null,
    prices: [{ size_name: 'Regular', price_cents: 0, is_active: true, sort_order: 0 }]
  })
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          category_i18n!inner(name)
        `)
        .eq('is_active', true)
        .eq('category_i18n.locale', 'en')

      if (error) throw error

      setCategories(data?.map(cat => ({
        id: cat.id,
        name: cat.category_i18n[0]?.name || 'Unknown'
      })) || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const loadItemData = useCallback(async () => {
    if (!item) return

    try {
      // Fetch item i18n data
      const { data: i18nData } = await supabase
        .from('item_i18n')
        .select('*')
        .eq('item_id', item.id)

      // Fetch item prices
      const { data: pricesData } = await supabase
        .from('item_prices')
        .select('*')
        .eq('item_id', item.id)
        .order('sort_order')

      const i18nMap = i18nData?.reduce((acc, curr) => {
        acc[curr.locale] = curr
        return acc
      }, {} as Record<string, { name: string; description?: string }>) || {}

      setFormData({
        name_en: i18nMap.en?.name || '',
        name_ar: i18nMap.ar?.name || '',
        name_tr: i18nMap.tr?.name || '',
        description_en: i18nMap.en?.description || '',
        description_ar: i18nMap.ar?.description || '',
        description_tr: i18nMap.tr?.description || '',
        category_id: item.category_id,
        sort_order: item.sort_order,
        is_active: item.is_active,
        image_file: null,
        prices: pricesData?.length ? pricesData.map(p => ({
          size_name: p.size_name,
          price_cents: p.price_cents,
          is_active: p.is_active,
          sort_order: p.sort_order
        })) : [{ size_name: 'Regular', price_cents: 0, is_active: true, sort_order: 0 }]
      })

      setImagePreview(item.image_url || null)
    } catch (err) {
      console.error('Error loading item data:', err)
    }
  }, [item])

  useEffect(() => {
    fetchCategories()
    if (item) {
      loadItemData()
    }
  }, [item, loadItemData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image_file: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, {
        size_name: '',
        price_cents: 0,
        is_active: true,
        sort_order: prev.prices.length
      }]
    }))
  }

  const removePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }))
  }

  const updatePrice = (index: number, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map((price, i) => 
        i === index ? { ...price, [field]: value } : price
      )
    }))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = imagePreview

      // Upload new image if provided
      if (formData.image_file) {
        const uploadedUrl = await uploadImage(formData.image_file)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      let itemId = item?.id

      // Create or update item
      if (itemId) {
        // Update existing item
        const { error: itemError } = await supabase
          .from('items')
          .update({
            category_id: formData.category_id,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemId)

        if (itemError) throw itemError
      } else {
        // Create new item
        const { data: newItem, error: itemError } = await supabase
          .from('items')
          .insert({
            category_id: formData.category_id,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
            image_url: imageUrl
          })
          .select()
          .single()

        if (itemError) throw itemError
        itemId = newItem.id
      }

      // Update i18n data
      const i18nData = [
        { item_id: itemId, locale: 'en', name: formData.name_en, description: formData.description_en },
        { item_id: itemId, locale: 'ar', name: formData.name_ar, description: formData.description_ar },
        { item_id: itemId, locale: 'tr', name: formData.name_tr, description: formData.description_tr }
      ]

      // Delete existing i18n data
      await supabase
        .from('item_i18n')
        .delete()
        .eq('item_id', itemId)

      // Insert new i18n data
      const { error: i18nError } = await supabase
        .from('item_i18n')
        .insert(i18nData)

      if (i18nError) throw i18nError

      // Update prices
      // Delete existing prices
      await supabase
        .from('item_prices')
        .delete()
        .eq('item_id', itemId)

      // Insert new prices
      const pricesData = formData.prices.map((price, index) => ({
        item_id: itemId!,
        size_name: price.size_name,
        price_cents: Math.round(price.price_cents),
        is_active: price.is_active,
        sort_order: index
      }))

      const { error: pricesError } = await supabase
        .from('item_prices')
        .insert(pricesData)

      if (pricesError) throw pricesError

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-lg sm:rounded-lg">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Multilingual Names */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Names</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Name
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arabic Name
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turkish Name
                </label>
                <input
                  type="text"
                  value={formData.name_tr}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_tr: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Multilingual Descriptions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Descriptions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Description
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arabic Description
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turkish Description
                </label>
                <textarea
                  value={formData.description_tr}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Image</h3>
            <div className="flex items-start space-x-4">
              {imagePreview && (
                <div className="w-32 h-32 relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a high-quality image for this item
                </p>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Prices</h3>
              <button
                type="button"
                onClick={addPrice}
                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-green-200"
              >
                Add Price
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.prices.map((price, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Size name (e.g., Small, Medium, Large)"
                      value={price.size_name}
                      onChange={(e) => updatePrice(index, 'size_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Price (TL)"
                      step="0.01"
                      value={price.price_cents / 100}
                      onChange={(e) => updatePrice(index, 'price_cents', Math.round(parseFloat(e.target.value || '0') * 100))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={price.is_active}
                        onChange={(e) => updatePrice(index, 'is_active', e.target.checked)}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePrice(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={formData.prices.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Publish this item (make it visible to customers)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
