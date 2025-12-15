import { STATE_TAX_RATES, LUMP_SUM_PERCENTAGE, TOTAL_FEDERAL_TAX } from './constants'

export interface TaxCalculation {
  jackpot: number
  lumpSum: number
  federalTax: number
  stateTax: number
  netTakeHome: number
}

export function calculateNetTakeHome(
  jackpot: number,
  state: string,
  payoutType: 'lump-sum' | 'annuity'
): TaxCalculation {
  const lumpSum = payoutType === 'lump-sum' ? jackpot * LUMP_SUM_PERCENTAGE : jackpot
  const federalTax = lumpSum * TOTAL_FEDERAL_TAX
  const stateTaxRate = STATE_TAX_RATES[state] || 0
  const stateTax = lumpSum * (stateTaxRate / 100)
  const netTakeHome = lumpSum - federalTax - stateTax

  return {
    jackpot,
    lumpSum,
    federalTax,
    stateTax,
    netTakeHome,
  }
}

export function calculateInvestmentGrowth(
  principal: number,
  annualReturn: number,
  years: number
): number {
  return principal * Math.pow(1 + annualReturn / 100, years)
}

export function calculateProjections(
  principal: number,
  annualReturn: number
): { year: number; value: number }[] {
  const projections = []
  for (let year = 0; year <= 30; year += 5) {
    projections.push({
      year,
      value: year === 0 ? principal : calculateInvestmentGrowth(principal, annualReturn, year),
    })
  }
  return projections
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}
