export const STATE_TAX_RATES: Record<string, number> = {
  'Alabama': 0,
  'Alaska': 0,
  'Arizona': 4.8,
  'Arkansas': 5.5,
  'California': 13.3,
  'Colorado': 4.55,
  'Connecticut': 6.99,
  'Delaware': 6.6,
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
  { id: 'car-loan', label: 'Car Loan', amount: 42000, enabled: true },
  { id: 'medical-bills', label: 'Medical Bills', amount: 18500, enabled: true },
  { id: 'family-support', label: 'Parent/Family Support', amount: 50000, enabled: true },
  { id: 'business-loan', label: 'Business Loan', amount: 125000, enabled: true },
]

// Domiciles - Dream homes and properties
export const DEFAULT_DOMICILES = [
  { id: 'dream-home', label: 'Dream Home', amount: 3500000, why: 'Space to breathe and grow', enabled: true },
  { id: 'vacation-home', label: 'Vacation Property', amount: 1500000, why: 'A getaway to call my own', enabled: false },
  { id: 'investment-property', label: 'Investment Property', amount: 800000, why: 'Building wealth through real estate', enabled: false },
]

// Travel & Toys - Vehicles, trips, experiences
export const DEFAULT_TRAVEL_TOYS = [
  { id: 'dream-car', label: 'Dream Car', amount: 250000, why: 'Drive in style', enabled: true },
  { id: 'travel-fund', label: 'Travel Fund', amount: 500000, why: 'See the world', enabled: true },
  { id: 'boat-rv', label: 'Boat / RV', amount: 350000, why: 'Adventure awaits', enabled: false },
  { id: 'experiences', label: 'Epic Experiences', amount: 200000, why: 'Making memories', enabled: true },
]

// Share the Wealth - Family, friends, charity
export const DEFAULT_SHARE_WEALTH = [
  { id: 'family-gifts', label: 'Family Gifts', amount: 500000, why: 'Take care of the people I love', enabled: true },
  { id: 'friends-gifts', label: 'Friends', amount: 100000, why: 'Pay it forward', enabled: false },
  { id: 'charity', label: 'Charity / Causes', amount: 500000, why: 'Give back to my community', enabled: true },
  { id: 'education-fund', label: 'Education Fund (kids/family)', amount: 300000, why: 'Invest in their future', enabled: true },
]

// Annual lifestyle expenses (Your New Normal)
export const DEFAULT_ANNUAL_EXPENSES = [
  { id: 'housing', label: 'Housing (utilities, maintenance, property tax)', amount: 60000, enabled: true },
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
      { id: 'travel-fund', amount: 750000, enabled: true },
      { id: 'boat-rv', amount: 500000, enabled: true },
      { id: 'experiences', amount: 300000, enabled: true },
    ],
    shareWealth: [
      { id: 'family-gifts', amount: 2000000, enabled: true },
      { id: 'friends-gifts', amount: 500000, enabled: true },
      { id: 'charity', amount: 5000000, enabled: true },
      { id: 'education-fund', amount: 1000000, enabled: true },
    ],
    annualExpenses: [
      { id: 'housing', amount: 120000, enabled: true },
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
      { id: 'boat-rv', amount: 0, enabled: false },
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
