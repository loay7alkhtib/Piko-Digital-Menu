import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getItemById } from '@/lib/queries'
import Price from '@/components/Price'
import LocaleSwitch from '@/components/LocaleSwitch'

interface ItemPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params
  
  // For now, using English as default - will be enhanced with client-side locale switching
  const item = await getItemById(id, 'en')
  
  if (!item) {
    notFound()
  }

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
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
            </div>
            <LocaleSwitch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Item Image */}
          <div className="aspect-video relative">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-6xl">📷</span>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  {item.category_name}
                </p>
              </div>
              
              {item.prices.length > 0 && (
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-500 mb-1">Starting from</div>
                  <Price 
                    cents={Math.min(...item.prices.map(p => p.price_cents))} 
                    className="text-3xl"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Prices */}
            {item.prices.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Sizes & Prices
                </h3>
                <div className="space-y-3">
                  {item.prices.map((price) => (
                    <div 
                      key={price.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {price.size_name}
                        </span>
                      </div>
                      <Price 
                        cents={price.price_cents} 
                        className="text-xl font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
