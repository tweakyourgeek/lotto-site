import type { Debt } from '@/components/calculator/DebtSection'
import type { LifestyleItem } from '@/components/calculator/LifestyleSection'

export interface WizardData {
  currentStep: number
  visitedSteps: number[]
  jackpot: number
  state: string
  payoutType: 'lump-sum' | 'annuity'
  filingStatus: string
  debts: Debt[]
  lifestyleItems: LifestyleItem[]
  investmentAmount: number
  annualReturn: number
}

const STORAGE_KEY = 'lottery-wizard-data'

export function saveWizardData(data: Partial<WizardData>): void {
  if (typeof window === 'undefined') return

  try {
    const existing = loadWizardData()
    const updated = { ...existing, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save wizard data:', error)
  }
}

export function loadWizardData(): Partial<WizardData> {
  if (typeof window === 'undefined') return {}

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return {}
    return JSON.parse(saved)
  } catch (error) {
    console.error('Failed to load wizard data:', error)
    return {}
  }
}

export function clearWizardData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear wizard data:', error)
  }
}
