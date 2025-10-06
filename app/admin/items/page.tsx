'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import type { Item, ItemI18n } from '@/app/(data)/queries'
import EditDrawer from './EditDrawer'

interface ItemWithI18n extends Item {
  item_i18n: ItemI18n[]
  category_name?: string
}

export default function AdminItems() {
  const [items, setItems] = useState<ItemWithI18n[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState<ItemWithI18n | null>(null)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/admin/login')
      return
    }

    // Check if user has staff role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'staff') {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
    fetchItems()
  }, [checkAuth])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          item_i18n(*),
          categories!inner(
            category_i18n!inner(name)
          )
        `)
        .eq('categories.category_i18n.locale', 'en')
        .order('sort_order')

      if (error) throw error

      setItems(data || [])
    } catch (err) {
      setError('Failed to fetch items')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleEditItem = (item: ItemWithI18n) => {
    setSelectedItem(item)
    setShowEditDrawer(true)
  }

  const handleSaveItem = () => {
    fetchItems() // Refresh the list
    setShowEditDrawer(false)
    setSelectedItem(null)
  }

  const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ is_active: !currentStatus })
        .eq('id', itemId)

      if (error) throw error

      // Update local state
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, is_active: !currentStatus }
          : item
      ))
    } catch (err) {
      console.error('Error updating item status:', err)
    }
  }

  const getItemName = (item: ItemWithI18n) => {
    const enName = item.item_i18n.find(i18n => i18n.locale === 'en')
    return enName?.name || 'Untitled'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin - Items Management</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Public Menu
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
          <button
            onClick={() => handleEditItem({} as ItemWithI18n)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Item
          </button>
        </div>

        {/* Items Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first menu item.
              </p>
              <button
                onClick={() => handleEditItem({} as ItemWithI18n)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={getItemName(item)}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">📷</span>
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getItemName(item)}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Category: {item.category_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sort Order: {item.sort_order}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleItemStatus(item.id, item.is_active)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          item.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Edit Drawer */}
      {showEditDrawer && (
        <EditDrawer
          item={selectedItem}
          onClose={() => {
            setShowEditDrawer(false)
            setSelectedItem(null)
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  )
}
