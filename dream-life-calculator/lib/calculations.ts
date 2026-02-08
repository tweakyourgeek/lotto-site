export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export interface IncomeBreakdown {
  annual: number
  monthly: number
  weekly: number
  daily: number
  hourly: number
}

/**
 * Calculate the income needed to fund a given annual expense total.
 * Assumes ~2,080 working hours/year (40hr weeks, 52 weeks).
 */
export function calculateIncomeNeeded(totalAnnualCost: number): IncomeBreakdown {
  const annual = totalAnnualCost
  const monthly = annual / 12
  const weekly = annual / 52
  const daily = annual / 365
  const hourly = annual / 2080

  return { annual, monthly, weekly, daily, hourly }
}
