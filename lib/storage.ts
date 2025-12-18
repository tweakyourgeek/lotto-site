import type { Debt } from '@/components/calculator/DebtSection'
import type { LifestyleItem } from '@/components/calculator/LifestyleSection'
import type { AnnualExpense } from '@/components/calculator/AnnualExpenses'
import type { SpendingItem } from '@/components/calculator/SpendingSection'
import type { PresetType } from '@/lib/constants'

export interface WizardData {
  currentStep: number
  visitedSteps: number[]
  jackpot: number
  state: string
  payoutType: 'lump-sum' | 'annuity'
  filingStatus: string
  selectedPreset: PresetType
  debts: Debt[]
  domiciles: SpendingItem[]
  travelToys: SpendingItem[]
  shareWealth: SpendingItem[]
  annualExpenses: AnnualExpense[]
  investmentAmount: number
  annualReturn: number
  // Legacy support
  lifestyleItems?: LifestyleItem[]
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
