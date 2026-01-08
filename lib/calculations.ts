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

// Dream Life Calculator Functions
export interface DreamExpense {
  amount: number
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'once'
  enabled: boolean
}

export function calculateAnnualCost(expense: DreamExpense): number {
  if (!expense.enabled) return 0

  const { amount, frequency } = expense

  switch (frequency) {
    case 'weekly':
      return amount * 52
    case 'monthly':
      return amount * 12
    case 'quarterly':
      return amount * 4
    case 'yearly':
    case 'once':
      return amount
    default:
      return 0
  }
}

export function calculateTotalAnnualExpenses(expenses: DreamExpense[]): number {
  return expenses.reduce((total, expense) => total + calculateAnnualCost(expense), 0)
}

export interface IncomeNeeded {
  annualNet: number
  annualGross: number
  monthly: number
  weekly: number
  daily: number
  hourly: number
}

export function calculateIncomeNeeded(annualExpenses: number, taxRate: number = 0.30): IncomeNeeded {
  const annualGross = annualExpenses / (1 - taxRate)

  return {
    annualNet: annualExpenses,
    annualGross,
    monthly: annualExpenses / 12,
    weekly: annualExpenses / 52,
    daily: annualExpenses / 365,
    hourly: annualExpenses / 365 / 24,
  }
}

export interface PathToIncome {
  type: 'salary' | 'side-hustle' | 'investment' | 'lottery'
  title: string
  description: string
  amount: string
  timeframe?: string
}

export function calculatePathsToIncome(annualGross: number, currentIncome: number = 0): PathToIncome[] {
  const gap = Math.max(0, annualGross - currentIncome)
  const investmentPrincipal = annualGross / 0.04 // 4% withdrawal rate
  const monthlyInvestment = gap / 12

  return [
    {
      type: 'salary',
      title: currentIncome > 0 ? 'Salary Increase Needed' : 'Salary Target',
      description: currentIncome > 0 ? `Increase your income by ${formatCurrency(gap)}` : `Target annual salary of ${formatCurrency(annualGross)}`,
      amount: formatCurrency(gap || annualGross),
      timeframe: 'Career advancement, job change, or negotiation',
    },
    {
      type: 'side-hustle',
      title: 'Side Hustle Income',
      description: 'Generate passive or active side income',
      amount: `${formatCurrency(monthlyInvestment)}/month`,
      timeframe: 'Freelancing, consulting, or business',
    },
    {
      type: 'investment',
      title: 'Investment Income',
      description: 'Invest and withdraw 4% annually',
      amount: formatCurrency(investmentPrincipal),
      timeframe: 'Build a portfolio over 10-20 years',
    },
    {
      type: 'lottery',
      title: 'Lottery Approach',
      description: 'Win big, invest the winnings',
      amount: formatCurrency(investmentPrincipal * 2.5), // Account for taxes
      timeframe: 'Lightning strikes... maybe?',
    },
  ]
}
