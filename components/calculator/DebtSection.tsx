'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/calculations'

export interface Debt {
  id: string
  label: string
  amount: number
  enabled: boolean
  notes?: string
}

interface DebtSectionProps {
  debts: Debt[]
  onDebtsChange: (debts: Debt[]) => void
}

export default function DebtSection({ debts, onDebtsChange }: DebtSectionProps) {
  const totalRelief = debts
    .filter((debt) => debt.enabled)
    .reduce((sum, debt) => sum + debt.amount, 0)

  const maxDebt = Math.max(...debts.map((d) => d.amount))

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    onDebtsChange(
      debts.map((debt) => (debt.id === id ? { ...debt, ...updates } : debt))
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-4 hidden md:block">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          Clear the Deck
        </h2>
        <p className="text-lg text-navy">What debts would you wipe out?</p>
      </div>
      <div className="mb-4 md:hidden">
        <p className="text-lg text-navy">What debts would you wipe out?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debts.map((debt) => (
          <div key={debt.id} className="border-b border-light-blush pb-3">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id={`debt-${debt.id}`}
                  checked={debt.enabled}
                  onChange={(e) => updateDebt(debt.id, { enabled: e.target.checked })}
                  className="w-5 h-5 text-primary-purple border-dusty-rose rounded focus:ring-2 focus:ring-light-lavender"
                  aria-label={`Pay off ${debt.label}`}
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`debt-${debt.id}`} className="block font-medium text-navy mb-2">
                  {debt.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary-purple">
                    $
                  </span>
                  <input
                    type="text"
                    value={debt.amount.toLocaleString()}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      updateDebt(debt.id, { amount: Number(value) || 0 })
                    }}
                    className="w-full pl-8 pr-4 py-2 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
                    disabled={!debt.enabled}
                  />
                </div>
                {debt.enabled && (
                  <div className="mt-2 bg-light-blush rounded-lg h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-light-lavender to-dusty-rose h-full transition-all duration-300"
                      style={{ width: `${(debt.amount / maxDebt) * 100}%` }}
                    />
                  </div>
                )}
                {debt.enabled && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={debt.notes || ''}
                      onChange={(e) => updateDebt(debt.id, { notes: e.target.value })}
                      placeholder="Notes (optional)"
                      className="w-full px-3 py-1.5 text-sm border border-dusty-rose/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender italic text-navy/70"
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
          <p className="text-sm text-navy mb-2">Total Relief</p>
          <div className="text-4xl md:text-5xl font-bold text-primary-purple">
            {formatCurrency(totalRelief)}
          </div>
          <p className="text-lg text-mauve-pink mt-3 italic">
            How does it feel to clear that?
          </p>
        </div>
      </div>
    </div>
  )
}
