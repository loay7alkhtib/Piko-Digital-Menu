import { formatPrice } from '@/app/(utils)/format'

interface PriceProps {
  cents: number
  className?: string
}

export default function Price({ cents, className = '' }: PriceProps) {
  return (
    <span className={`font-semibold text-green-600 ${className}`}>
      {formatPrice(cents)}
    </span>
  )
}
