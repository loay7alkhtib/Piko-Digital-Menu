import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemsByCategory, getCategoryBySlug } from '@/app/(data)/queries'
import Card from '@/components/Card'
import LocaleSwitch from '@/components/LocaleSwitch'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  
  // For now, using English as default - will be enhanced with client-side locale switching
  const category = await getCategoryBySlug(categorySlug, 'en')
  
  if (!category) {
    notFound()
  }

  const items = await getItemsByCategory(categorySlug, 'en')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Categories
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            </div>
            <LocaleSwitch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h2>
          <p className="text-lg text-gray-600">
            Browse our delicious {category.name.toLowerCase()} items
          </p>
        </div>

        {/* Items Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                name={item.name}
                imageUrl={item.image_url}
                priceCents={item.min_price_cents}
                href={`/item/${item.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items in this category
            </h3>
            <p className="text-gray-500">
              Items will appear here once they&apos;re added to this category.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// Generate static params for known categories (optional optimization)
export async function generateStaticParams() {
  // This would fetch all category slugs for static generation
  // For now, we'll use dynamic rendering
  return []
}
