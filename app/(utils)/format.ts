/**
 * Format price from cents to Turkish Lira (TRY)
 * No decimals unless needed (e.g., 1500 cents = 15 TL, not 15.00 TL)
 */
export function formatPrice(cents: number): string {
  const lira = cents / 100
  return lira % 1 === 0 ? `${lira} TL` : `${lira.toFixed(2)} TL`
}

/**
 * Format currency for display (Turkish Lira symbol)
 */
export function formatCurrency(cents: number): string {
  const lira = cents / 100
  return lira % 1 === 0 ? `${lira} ₺` : `${lira.toFixed(2)} ₺`
}

/**
 * Get the minimum price from an array of prices in cents
 */
export function getMinPrice(prices: { price_cents: number }[]): number {
  if (!prices.length) return 0
  return Math.min(...prices.map(p => p.price_cents))
}

/**
 * Get the maximum price from an array of prices in cents
 */
export function getMaxPrice(prices: { price_cents: number }[]): number {
  if (!prices.length) return 0
  return Math.max(...prices.map(p => p.price_cents))
}
