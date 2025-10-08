import Link from 'next/link'
import { getActiveCategories } from '@/lib/queries'
import LocaleSwitch from '@/components/LocaleSwitch'

export default async function Home() {
  // For now, we'll use English as default since this is server-side
  // The client-side locale switching will work on other pages
  const categories = await getActiveCategories('en')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Piko Menu</h1>
            <LocaleSwitch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose a Category
          </h2>
          <p className="text-lg text-gray-600">
            Select a category to browse our delicious menu items
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
              >
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-500 mt-2">
                  View items in this category
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories available
            </h3>
            <p className="text-gray-500">
              Categories will appear here once they&apos;re added to the system.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
