'use client'

import { formatCurrency, calculateIncomeNeeded } from '../lib/calculations'

interface CostBreakdownProps {
  totalAnnualExpenses: number
}

export default function CostBreakdown({ totalAnnualExpenses }: CostBreakdownProps) {
  const income = calculateIncomeNeeded(totalAnnualExpenses)

  const breakdown = [
    { label: 'Annual', value: income.annual, width: 100 },
    { label: 'Monthly', value: income.monthly, width: 80 },
    { label: 'Weekly', value: income.weekly, width: 60 },
    { label: 'Daily', value: income.daily, width: 40 },
    { label: 'Hourly', value: income.hourly, width: 20 },
  ]

  return (
    <div className="bg-gradient-to-br from-primary-purple to-navy rounded-2xl shadow-lg p-8 md:p-12 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Your Dream Life Costs
      </h2>
      <p className="text-center text-lg mb-2 opacity-90">
        Here's the income you need to fund it:
      </p>
      <p className="text-center text-sm mb-8 opacity-70">
        (Based on ~2,080 working hours/year)
      </p>

      <div className="space-y-6 max-w-3xl mx-auto">
        {breakdown.map((item, index) => (
          <div key={item.label} className="relative">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium opacity-80">{item.label}</span>
              <span className="text-2xl md:text-3xl font-bold">
                {formatCurrency(item.value)}
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-light-blush to-dusty-rose h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${item.width}%`,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
