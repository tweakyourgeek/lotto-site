'use client'

import { formatCurrency } from '@/lib/calculations'

export interface SpendingItem {
  id: string
  label: string
  amount: number
  why?: string
  enabled: boolean
}

interface SpendingSectionProps {
  title: string
  subtitle: string
  items: SpendingItem[]
  onItemsChange: (items: SpendingItem[]) => void
  totalLabel?: string
  emptyMessage?: string
  showWhy?: boolean
}

export default function SpendingSection({
  title,
  subtitle,
  items,
  onItemsChange,
  totalLabel = 'Total',
  emptyMessage = "What would you choose?",
  showWhy = true,
}: SpendingSectionProps) {
  const total = items
    .filter((item) => item.enabled)
    .reduce((sum, item) => sum + item.amount, 0)

  const maxAmount = Math.max(...items.filter(i => i.enabled).map((i) => i.amount), 1)

  const updateItem = (id: string, updates: Partial<SpendingItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const handleSkipAll = () => {
    onItemsChange(
      items.map((item) => ({ ...item, enabled: false, amount: 0 }))
    )
  }

  const handleUseDefaults = () => {
    onItemsChange(
      items.map((item) => ({ ...item, enabled: true }))
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-4 hidden md:block">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          {title}
        </h2>
        <p className="text-lg text-navy">{subtitle}</p>
      </div>
      <div className="mb-4 md:hidden">
        <p className="text-lg text-navy">{subtitle}</p>
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleUseDefaults}
          className="px-4 py-2 text-sm font-medium text-primary-purple border-2 border-primary-purple rounded-lg hover:bg-primary-purple hover:text-white transition-colors"
        >
          Use Defaults
        </button>
        <button
          onClick={handleSkipAll}
          className="px-4 py-2 text-sm font-medium text-navy/60 border-2 border-navy/30 rounded-lg hover:bg-navy/10 transition-colors"
        >
          Skip This Section ($0)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border-b border-light-blush pb-3">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={item.enabled}
                  onChange={(e) => updateItem(item.id, { enabled: e.target.checked })}
                  className="w-5 h-5 text-primary-purple border-dusty-rose rounded focus:ring-2 focus:ring-light-lavender"
                  aria-label={`Include ${item.label}`}
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`item-${item.id}`} className="block font-medium text-navy mb-2">
                  {item.label}
                </label>
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary-purple">
                    $
                  </span>
                  <input
                    type="text"
                    value={item.amount.toLocaleString()}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      updateItem(item.id, { amount: Number(value) || 0 })
                    }}
                    className="w-full pl-8 pr-4 py-2 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender disabled:opacity-50"
                    disabled={!item.enabled}
                  />
                </div>
                {item.enabled && (
                  <div className="bg-light-blush rounded-lg h-3 overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-mauve-pink to-light-lavender h-full transition-all duration-300"
                      style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                )}
                {showWhy && item.enabled && (
                  <div>
                    <label htmlFor={`why-${item.id}`} className="block text-sm text-navy/70 mb-1">
                      Why This Matters
                    </label>
                    <input
                      id={`why-${item.id}`}
                      type="text"
                      value={item.why || ''}
                      onChange={(e) => updateItem(item.id, { why: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-dusty-rose/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender italic"
                      placeholder="What does this mean to you?"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-dusty-rose md:col-span-2">
        <div className="text-center">
          <p className="text-sm text-navy mb-2">{totalLabel}</p>
          <div className="text-4xl md:text-5xl font-bold text-primary-purple">
            {formatCurrency(total)}
          </div>
          {total === 0 && (
            <p className="text-lg text-mauve-pink mt-3 italic">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
