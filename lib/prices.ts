// Fixed list prices per currency, set by Maison Sanguine (not a live exchange rate).
// Keys are the price in euros, values are whole amounts in each currency.
// A currency that is not listed falls back to the price in euros.

export const FIXED: Record<number, Record<string, number>> = {
  850: {
    usd: 950, gbp: 750, aud: 1550, aed: 3600, sgd: 1300, hkd: 7500, jpy: 140000, krw: 1300000,
    cny: 6800, twd: 31000, mxn: 17000, brl: 5100, mop: 7700, czk: 21500, ils: 3400, myr: 4300, thb: 34000,
  },
  1500: {
    usd: 1700, gbp: 1300, aud: 2700, aed: 6400, sgd: 2300, hkd: 13200, jpy: 250000, krw: 2300000,
    cny: 12000, twd: 54000, mxn: 30000, brl: 9000, mop: 13600, czk: 38000, ils: 6000, myr: 7500, thb: 60000,
  },
  1750: {
    usd: 1950, gbp: 1500, aud: 3100, aed: 7400, sgd: 2700, hkd: 15200, jpy: 290000, krw: 2700000,
    cny: 14000, twd: 63000, mxn: 35000, brl: 10500, mop: 15800, czk: 44000, ils: 7000, myr: 8700, thb: 70000,
  },
}

const ZERO_DECIMAL = ['jpy', 'krw']

// Whole amount for a currency, or null when the price stays in euros.
export function fixedPrice(eur: number, currency: string): number | null {
  const v = FIXED[eur]?.[currency.toLowerCase()]
  return v && v > 0 ? v : null
}

// Amount in the smallest unit Stripe expects.
export function minorUnits(amount: number, currency: string) {
  return ZERO_DECIMAL.includes(currency.toLowerCase()) ? amount : amount * 100
}

// "850 €", "$950", "£750", "HKD 7,500".
export function formatPrice(amount: number, currency: string) {
  const c = currency.toUpperCase()
  if (c === 'EUR') return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
  if (c === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  if (c === 'GBP') return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount)
  return `${c} ${new Intl.NumberFormat('en-US').format(amount)}`
}
