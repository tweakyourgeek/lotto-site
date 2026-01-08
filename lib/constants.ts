export const STATE_TAX_RATES: Record<string, number> = {
  'International': 0, // For users outside the US - consult local tax authorities
  'Alabama': 0,
  'Alaska': 0,
  'Arizona': 4.8,
  'Arkansas': 5.5,
  'California': 0, // CA exempts lottery winnings from state tax
  'Colorado': 4.55,
  'Connecticut': 6.99,
  'Delaware': 0, // DE exempts lottery winnings from state tax
  'Florida': 0,
  'Georgia': 5.75,
  'Hawaii': 11.0,
  'Idaho': 6.5,
  'Illinois': 4.95,
  'Indiana': 3.23,
  'Iowa': 8.53,
  'Kansas': 5.7,
  'Kentucky': 5.0,
  'Louisiana': 6.0,
  'Maine': 7.15,
  'Maryland': 8.95,
  'Massachusetts': 5.0,
  'Michigan': 4.25,
  'Minnesota': 9.85,
  'Mississippi': 5.0,
  'Missouri': 5.4,
  'Montana': 6.9,
  'Nebraska': 6.84,
  'Nevada': 0,
  'New Hampshire': 0,
  'New Jersey': 10.75,
  'New Mexico': 5.9,
  'New York': 10.9,
  'North Carolina': 4.99,
  'North Dakota': 2.9,
  'Ohio': 3.99,
  'Oklahoma': 5.0,
  'Oregon': 9.9,
  'Pennsylvania': 3.07,
  'Rhode Island': 5.99,
  'South Carolina': 7.0,
  'South Dakota': 0,
  'Tennessee': 0,
  'Texas': 0,
  'Utah': 4.95,
  'Vermont': 8.75,
  'Virginia': 5.75,
  'Washington': 0,
  'West Virginia': 6.5,
  'Wisconsin': 7.65,
  'Wyoming': 0,
}

export const DEFAULT_DEBTS = [
  { id: 'mortgage', label: 'Mortgage', amount: 450000, enabled: true },
  { id: 'credit-cards', label: 'Credit Cards', amount: 35000, enabled: true },
  { id: 'student-loans', label: 'Student Loans', amount: 85000, enabled: true },
  { id: 'personal-loans', label: 'Personal Loans', amount: 25000, enabled: true },
  { id: 'car-loan', label: 'Car Loan', amount: 42000, enabled: true },
  { id: 'medical-bills', label: 'Medical Bills', amount: 18500, enabled: true },
  { id: 'family-support', label: 'Parent/Family Support', amount: 50000, enabled: true },
  { id: 'business-loan', label: 'Business Loan', amount: 125000, enabled: true },
  { id: 'other', label: 'Other/Miscellaneous', amount: 0, enabled: false },
]

// Domiciles - Dream homes and properties
export const DEFAULT_DOMICILES = [
  { id: 'dream-home', label: 'Dream Home', amount: 3500000, why: 'Space to breathe and grow', enabled: true },
  { id: 'vacation-home', label: 'Vacation Property', amount: 1500000, why: 'A getaway to call my own', enabled: false },
  { id: 'investment-property', label: 'Investment Property', amount: 800000, why: 'Building wealth through real estate', enabled: false },
]

// Luxury & Travel - Vehicles, trips, luxury items
export const DEFAULT_TRAVEL_TOYS = [
  { id: 'dream-car', label: 'Dream Car', amount: 250000, why: 'Drive in style', enabled: true },
  { id: 'travel-fund', label: 'Travel Fund', amount: 500000, why: 'See the world', enabled: true },
  { id: 'private-jet', label: 'Private Jet', amount: 15000000, why: 'Travel in ultimate style', enabled: false },
  { id: 'boat-yacht', label: 'Yacht', amount: 10000000, why: 'Life on the water', enabled: false },
  { id: 'rocket-space', label: 'Space Flight', amount: 450000, why: 'To infinity and beyond', enabled: false },
  { id: 'jewelry', label: 'Jewelry & Watches', amount: 1000000, why: 'Timeless luxury', enabled: false },
  { id: 'experiences', label: 'Epic Experiences', amount: 200000, why: 'Making memories', enabled: true },
]

// Share the Wealth - Family, friends, charity
export const DEFAULT_SHARE_WEALTH = [
  { id: 'family-gifts', label: 'Family Gifts', amount: 500000, why: 'Take care of the people I love', enabled: true },
  { id: 'friends-gifts', label: 'Friends', amount: 100000, why: 'Pay it forward', enabled: false },
  { id: 'charity', label: 'Charity / Causes', amount: 500000, why: 'Give back to my community', enabled: true },
  { id: 'education-fund', label: 'Education Fund (Self, Others)', amount: 300000, why: 'Invest in the future', enabled: true },
]

// Annual lifestyle expenses (Your New Normal)
export const DEFAULT_ANNUAL_EXPENSES = [
  { id: 'housing', label: 'Housing (utilities, maintenance, property tax)', amount: 60000, enabled: true },
  { id: 'insurance', label: 'Insurance (home, auto, umbrella, life)', amount: 25000, enabled: true },
  { id: 'travel', label: 'Travel Budget', amount: 50000, enabled: true },
  { id: 'charity', label: 'Annual Giving', amount: 25000, enabled: true },
  { id: 'entertainment', label: 'Fun & Entertainment', amount: 30000, enabled: true },
  { id: 'transport', label: 'Transportation', amount: 15000, enabled: true },
  { id: 'health', label: 'Health & Wellness', amount: 20000, enabled: true },
  { id: 'other', label: 'Everything Else', amount: 20000, enabled: true },
]

// Legacy DEFAULT_LIFESTYLE for backwards compatibility
export const DEFAULT_LIFESTYLE = [
  { id: 'dream-home', label: 'Dream Home', amount: 3500000, why: 'Space to breathe and grow' },
  { id: 'travel', label: 'Travel Fund', amount: 750000, why: 'See the world without worrying' },
  { id: 'family-gifts', label: 'Family Gifts', amount: 500000, why: 'Take care of the people I love' },
  { id: 'education', label: 'Education Fund', amount: 200000, why: 'Learning and growing' },
  { id: 'vehicles', label: 'New Vehicles', amount: 350000, why: 'Reliable transportation' },
  { id: 'renovation', label: 'Home Renovation', amount: 500000, why: 'Create the perfect space' },
  { id: 'experiences', label: 'Experiences', amount: 300000, why: 'Making memories' },
  { id: 'charity', label: 'Charity', amount: 250000, why: 'Give back to my community' },
]

// Spending Presets
export type PresetType = 'go-large' | 'chill' | 'custom'

export const PRESETS = {
  'go-large': {
    name: '🔥 Go Large',
    description: 'Live your biggest dreams',
    domiciles: [
      { id: 'dream-home', amount: 5000000, enabled: true },
      { id: 'vacation-home', amount: 2000000, enabled: true },
      { id: 'investment-property', amount: 1000000, enabled: false },
    ],
    travelToys: [
      { id: 'dream-car', amount: 350000, enabled: true },
      { id: 'travel-fund', amount: 1000000, enabled: true },
      { id: 'private-jet', amount: 25000000, enabled: true },
      { id: 'boat-yacht', amount: 15000000, enabled: true },
      { id: 'rocket-space', amount: 450000, enabled: true },
      { id: 'jewelry', amount: 2000000, enabled: true },
      { id: 'experiences', amount: 500000, enabled: true },
    ],
    shareWealth: [
      { id: 'family-gifts', amount: 2000000, enabled: true },
      { id: 'friends-gifts', amount: 500000, enabled: true },
      { id: 'charity', amount: 5000000, enabled: true },
      { id: 'education-fund', amount: 1000000, enabled: true },
    ],
    annualExpenses: [
      { id: 'housing', amount: 120000, enabled: true },
      { id: 'insurance', amount: 75000, enabled: true },
      { id: 'travel', amount: 100000, enabled: true },
      { id: 'charity', amount: 50000, enabled: true },
      { id: 'entertainment', amount: 75000, enabled: true },
      { id: 'transport', amount: 30000, enabled: true },
      { id: 'health', amount: 40000, enabled: true },
      { id: 'other', amount: 50000, enabled: true },
    ],
    investmentPercent: 0.4,
  },
  'chill': {
    name: '🧘 Keep It Chill',
    description: 'Comfortable and secure',
    domiciles: [
      { id: 'dream-home', amount: 750000, enabled: true },
      { id: 'vacation-home', amount: 0, enabled: false },
      { id: 'investment-property', amount: 0, enabled: false },
    ],
    travelToys: [
      { id: 'dream-car', amount: 75000, enabled: true },
      { id: 'travel-fund', amount: 200000, enabled: true },
      { id: 'private-jet', amount: 0, enabled: false },
      { id: 'boat-yacht', amount: 0, enabled: false },
      { id: 'rocket-space', amount: 0, enabled: false },
      { id: 'jewelry', amount: 50000, enabled: false },
      { id: 'experiences', amount: 100000, enabled: true },
    ],
    shareWealth: [
      { id: 'family-gifts', amount: 500000, enabled: true },
      { id: 'friends-gifts', amount: 50000, enabled: false },
      { id: 'charity', amount: 1000000, enabled: true },
      { id: 'education-fund', amount: 250000, enabled: true },
    ],
    annualExpenses: [
      { id: 'housing', amount: 36000, enabled: true },
      { id: 'insurance', amount: 15000, enabled: true },
      { id: 'travel', amount: 25000, enabled: true },
      { id: 'charity', amount: 15000, enabled: true },
      { id: 'entertainment', amount: 20000, enabled: true },
      { id: 'transport', amount: 10000, enabled: true },
      { id: 'health', amount: 15000, enabled: true },
      { id: 'other', amount: 15000, enabled: true },
    ],
    investmentPercent: 0.7,
  },
}

// Milestone thresholds for celebrations
export const SPENDING_MILESTONES = [
  { percent: 25, emoji: '💸', message: "You're just getting started!" },
  { percent: 50, emoji: '🎉', message: 'Halfway to zero!' },
  { percent: 75, emoji: '🔥', message: 'Big spender energy!' },
  { percent: 100, emoji: '🎊', message: 'You spent it ALL! Legend.' },
]

export const LUMP_SUM_PERCENTAGE = 0.458 // Actual average cash option (~45.8%)
export const FEDERAL_WITHHOLDING = 0.24
export const ADDITIONAL_FEDERAL_TAX = 0.13
export const TOTAL_FEDERAL_TAX = FEDERAL_WITHHOLDING + ADDITIONAL_FEDERAL_TAX // 37% total

// Dream Life Calculator - Expense Categories
export interface DreamExpense {
  id: string
  label: string
  amount: number
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'once'
  enabled: boolean
}

export const DEFAULT_HOME_EXPENSES: DreamExpense[] = [
  { id: 'mortgage-rent', label: 'Mortgage/Rent', amount: 1800, frequency: 'monthly', enabled: true },
  { id: 'property-tax', label: 'Property Taxes', amount: 2000, frequency: 'yearly', enabled: true },
  { id: 'home-insurance', label: 'Home Insurance', amount: 2000, frequency: 'yearly', enabled: true },
  { id: 'hoa', label: 'HOA Fees', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'maintenance', label: 'Maintenance/Repairs', amount: 2000, frequency: 'yearly', enabled: true },
  { id: 'utilities', label: 'Utilities (Electric, Water, Gas)', amount: 500, frequency: 'monthly', enabled: true },
]

export const DEFAULT_DAILY_RHYTHM: DreamExpense[] = [
  { id: 'groceries', label: 'Groceries', amount: 800, frequency: 'monthly', enabled: true },
  { id: 'dining-out', label: 'Dining Out', amount: 400, frequency: 'monthly', enabled: true },
  { id: 'transportation', label: 'Transportation/Gas', amount: 200, frequency: 'monthly', enabled: true },
  { id: 'car-insurance', label: 'Car Insurance', amount: 100, frequency: 'monthly', enabled: true },
  { id: 'phone-internet', label: 'Phone & Internet', amount: 150, frequency: 'monthly', enabled: true },
  { id: 'subscriptions', label: 'Subscriptions (Streaming, etc)', amount: 50, frequency: 'monthly', enabled: true },
]

export const DEFAULT_SUPPORT_SQUAD: DreamExpense[] = [
  { id: 'housekeeper', label: 'Housekeeper', amount: 150, frequency: 'weekly', enabled: false },
  { id: 'personal-assistant', label: 'Personal Assistant', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'chef', label: 'Personal Chef', amount: 0, frequency: 'weekly', enabled: false },
  { id: 'nanny-childcare', label: 'Nanny/Childcare', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'lawn-care', label: 'Lawn/Garden Service', amount: 0, frequency: 'monthly', enabled: false },
]

export const DEFAULT_SELF_CARE: DreamExpense[] = [
  { id: 'therapy', label: 'Therapy/Counseling', amount: 400, frequency: 'monthly', enabled: false },
  { id: 'gym', label: 'Gym Membership', amount: 80, frequency: 'monthly', enabled: true },
  { id: 'personal-trainer', label: 'Personal Trainer', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'spa-treatments', label: 'Spa Treatments', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'yoga-classes', label: 'Yoga/Fitness Classes', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'supplements', label: 'Vitamins/Supplements', amount: 0, frequency: 'monthly', enabled: false },
]

export const DEFAULT_ADVENTURES: DreamExpense[] = [
  { id: 'annual-vacation', label: 'Annual Vacation Budget', amount: 8000, frequency: 'yearly', enabled: true },
  { id: 'weekend-trips', label: 'Weekend Getaways', amount: 2000, frequency: 'yearly', enabled: false },
  { id: 'entertainment', label: 'Entertainment (Concerts, Shows)', amount: 200, frequency: 'monthly', enabled: true },
  { id: 'hobbies', label: 'Hobbies & Activities', amount: 150, frequency: 'monthly', enabled: true },
  { id: 'experiences', label: 'Epic Experiences', amount: 0, frequency: 'yearly', enabled: false },
]

export const DEFAULT_TIME_FREEDOM: DreamExpense[] = [
  { id: 'sabbatical-fund', label: 'Sabbatical Fund', amount: 0, frequency: 'yearly', enabled: false },
  { id: 'education', label: 'Education/Learning', amount: 0, frequency: 'yearly', enabled: false },
  { id: 'giving-back', label: 'Charitable Giving', amount: 0, frequency: 'monthly', enabled: false },
  { id: 'emergency-fund', label: 'Emergency Fund Contribution', amount: 500, frequency: 'monthly', enabled: true },
  { id: 'other', label: 'Other/Miscellaneous', amount: 200, frequency: 'monthly', enabled: true },
]

// Dream Life Presets
export type DreamPresetType = 'comfortable' | 'luxury-lite' | 'family-first' | 'custom'

export const DREAM_PRESETS = {
  comfortable: {
    name: '🏡 Comfortable Freedom',
    description: 'Work optional, modest lifestyle',
    totalAnnual: 75000,
  },
  'luxury-lite': {
    name: '✨ Luxury Lite',
    description: 'Nice things, not excessive',
    totalAnnual: 125000,
  },
  'family-first': {
    name: '👨‍👩‍👧‍👦 Family First',
    description: 'Kids, experiences, stability',
    totalAnnual: 95000,
  },
}
