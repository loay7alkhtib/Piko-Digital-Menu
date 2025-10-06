import Image from 'next/image'
import Link from 'next/link'
import Price from './Price'

interface CardProps {
  name: string
  imageUrl?: string
  priceCents: number
  href: string
  className?: string
}

export default function Card({ 
  name, 
  imageUrl, 
  priceCents, 
  href, 
  className = '' 
}: CardProps) {
  return (
    <Link 
      href={href}
      className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">📷</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <Price cents={priceCents} className="text-lg" />
      </div>
    </Link>
  )
}
