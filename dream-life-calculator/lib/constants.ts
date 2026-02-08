export interface DreamExpense {
  id: string
  label: string
  amount: number
  enabled: boolean
  category: 'recurring' | 'one-time'
}

// Realistic recurring monthly expenses (stored as annual amounts)
export const DEFAULT_RECURRING_EXPENSES: DreamExpense[] = [
  { id: 'housing', label: 'Housing (Rent/Mortgage)', amount: 24000, enabled: true, category: 'recurring' },
  { id: 'utilities', label: 'Utilities & Internet', amount: 3600, enabled: true, category: 'recurring' },
  { id: 'groceries', label: 'Groceries & Dining', amount: 9600, enabled: true, category: 'recurring' },
  { id: 'transportation', label: 'Transportation', amount: 6000, enabled: true, category: 'recurring' },
  { id: 'insurance', label: 'Insurance (Health/Auto/Home)', amount: 7200, enabled: true, category: 'recurring' },
  { id: 'subscriptions', label: 'Subscriptions & Memberships', amount: 2400, enabled: true, category: 'recurring' },
  { id: 'personal', label: 'Personal Care & Clothing', amount: 3000, enabled: true, category: 'recurring' },
  { id: 'entertainment', label: 'Entertainment & Hobbies', amount: 3600, enabled: true, category: 'recurring' },
  { id: 'travel', label: 'Travel & Vacations', amount: 5000, enabled: true, category: 'recurring' },
  { id: 'savings', label: 'Savings & Investments', amount: 12000, enabled: true, category: 'recurring' },
  { id: 'giving', label: 'Giving & Charity', amount: 2400, enabled: false, category: 'recurring' },
  { id: 'education', label: 'Education & Growth', amount: 2000, enabled: false, category: 'recurring' },
  { id: 'childcare', label: 'Childcare & Kids', amount: 0, enabled: false, category: 'recurring' },
  { id: 'pets', label: 'Pets', amount: 1200, enabled: false, category: 'recurring' },
  { id: 'other', label: 'Other', amount: 0, enabled: false, category: 'recurring' },
]

// One-time purchases (amortized over chosen period for income calculation)
export const DEFAULT_ONEOFF_EXPENSES: DreamExpense[] = [
  { id: 'home-down', label: 'Home Down Payment', amount: 0, enabled: false, category: 'one-time' },
  { id: 'car', label: 'New Car', amount: 0, enabled: false, category: 'one-time' },
  { id: 'wedding', label: 'Wedding', amount: 0, enabled: false, category: 'one-time' },
  { id: 'renovation', label: 'Home Renovation', amount: 0, enabled: false, category: 'one-time' },
  { id: 'startup', label: 'Start a Business', amount: 0, enabled: false, category: 'one-time' },
  { id: 'other-oneoff', label: 'Other Big Purchase', amount: 0, enabled: false, category: 'one-time' },
]

export interface Preset {
  label: string
  description: string
  recurringOverrides: { id: string; amount: number; enabled: boolean }[]
}

export const PRESETS: Record<string, Preset> = {
  comfortable: {
    label: 'Comfortable',
    description: 'Secure and stress-free',
    recurringOverrides: [
      { id: 'housing', amount: 18000, enabled: true },
      { id: 'groceries', amount: 7200, enabled: true },
      { id: 'travel', amount: 3000, enabled: true },
      { id: 'savings', amount: 6000, enabled: true },
    ],
  },
  ambitious: {
    label: 'Ambitious',
    description: 'Living well, saving hard',
    recurringOverrides: [
      { id: 'housing', amount: 30000, enabled: true },
      { id: 'groceries', amount: 12000, enabled: true },
      { id: 'travel', amount: 8000, enabled: true },
      { id: 'savings', amount: 18000, enabled: true },
      { id: 'education', amount: 5000, enabled: true },
    ],
  },
  dream: {
    label: 'Dream Big',
    description: 'Your best life, no compromises',
    recurringOverrides: [
      { id: 'housing', amount: 48000, enabled: true },
      { id: 'groceries', amount: 18000, enabled: true },
      { id: 'travel', amount: 15000, enabled: true },
      { id: 'savings', amount: 30000, enabled: true },
      { id: 'entertainment', amount: 7200, enabled: true },
      { id: 'giving', amount: 6000, enabled: true },
      { id: 'education', amount: 5000, enabled: true },
    ],
  },
}
