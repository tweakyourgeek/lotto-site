'use client'

import { formatCurrency } from '@/lib/calculations'

interface DreamLifeCostProps {
  annualExpenses: number
}

export default function DreamLifeCost({ annualExpenses }: DreamLifeCostProps) {
  const annual = annualExpenses
  const monthly = annual / 12
  const weekly = annual / 52
  const daily = annual / 365
  const hourly = annual / 365 / 24

  const breakdown = [
    { label: 'Annual', value: annual, width: 100 },
    { label: 'Monthly', value: monthly, width: 80 },
    { label: 'Weekly', value: weekly, width: 60 },
    { label: 'Daily', value: daily, width: 40 },
    { label: 'Hourly', value: hourly, width: 20 },
  ]

  return (
    <div className="bg-gradient-to-br from-primary-purple to-navy rounded-2xl shadow-lg p-8 md:p-12 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Your Dream Life Actually Costs
      </h2>
      <p className="text-center text-lg mb-8 opacity-90">
        When you break it down, here's what your choices mean...
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

      <div className="mt-12 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl">
          <p className="text-2xl md:text-3xl font-semibold mb-4">
            Good news: You probably don't need a billion dollars.
          </p>
          <p className="text-xl opacity-90">
            You need a plan.
          </p>
        </div>
      </div>
    </div>
  )
}
