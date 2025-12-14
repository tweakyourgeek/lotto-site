'use client'

import { formatCurrency } from '@/lib/calculations'

export interface LifestyleItem {
  id: string
  label: string
  amount: number
  why: string
}

interface LifestyleSectionProps {
  items: LifestyleItem[]
  onItemsChange: (items: LifestyleItem[]) => void
}

export default function LifestyleSection({ items, onItemsChange }: LifestyleSectionProps) {
  const totalDreams = items.reduce((sum, item) => sum + item.amount, 0)
  const maxAmount = Math.max(...items.map((i) => i.amount))

  const updateItem = (id: string, updates: Partial<LifestyleItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <div className="mb-8 hidden md:block">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          Fun + Dreams
        </h2>
        <p className="text-lg text-navy">What would you actually DO with the money?</p>
      </div>
      <div className="mb-6 md:hidden">
        <p className="text-lg text-navy">What would you actually DO with the money?</p>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="border-b border-light-blush pb-6">
            <div className="mb-3">
              <label htmlFor={`lifestyle-${item.id}`} className="block font-medium text-navy mb-2">
                {item.label}
              </label>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary-purple">
                  $
                </span>
                <input
                  id={`lifestyle-${item.id}`}
                  type="text"
                  value={item.amount.toLocaleString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    updateItem(item.id, { amount: Number(value) || 0 })
                  }}
                  className="w-full pl-8 pr-4 py-2 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
                />
              </div>
              <div className="bg-light-blush rounded-lg h-3 overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-mauve-pink to-light-lavender h-full transition-all duration-300"
                  style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                />
              </div>
              <div>
                <label htmlFor={`why-${item.id}`} className="block text-sm text-navy/70 mb-1">
                  Why This Matters
                </label>
                <input
                  id={`why-${item.id}`}
                  type="text"
                  value={item.why}
                  onChange={(e) => updateItem(item.id, { why: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-dusty-rose/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender italic"
                  placeholder="What does this mean to you?"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t-2 border-dusty-rose">
        <div className="text-center">
          <p className="text-sm text-navy mb-2">Total Dreams</p>
          <div className="text-4xl md:text-5xl font-bold text-primary-purple">
            {formatCurrency(totalDreams)}
          </div>
          <p className="text-lg text-mauve-pink mt-4 italic">
            Notice what showed up on your list?
          </p>
        </div>
      </div>
    </div>
  )
}
