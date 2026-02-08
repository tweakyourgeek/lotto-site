'use client'

import { formatCurrency } from '../lib/calculations'
import type { DreamExpense } from '../lib/constants'

interface ExpenseInputProps {
  title: string
  subtitle: string
  expenses: DreamExpense[]
  onExpensesChange: (expenses: DreamExpense[]) => void
  frequencyLabel?: string
}

export default function ExpenseInput({
  title,
  subtitle,
  expenses,
  onExpensesChange,
  frequencyLabel = 'per year',
}: ExpenseInputProps) {
  const enabledExpenses = expenses.filter((exp) => exp.enabled)
  const total = enabledExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const maxExpense = Math.max(...enabledExpenses.map((e) => e.amount), 1)

  const updateExpense = (id: string, updates: Partial<DreamExpense>) => {
    onExpensesChange(
      expenses.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="border-b border-light-blush pb-3">
            <div className="flex items-start gap-4 mb-2">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id={`expense-check-${expense.id}`}
                  checked={expense.enabled}
                  onChange={(e) => updateExpense(expense.id, { enabled: e.target.checked })}
                  className="w-5 h-5 text-primary-purple border-dusty-rose rounded focus:ring-2 focus:ring-light-lavender"
                  aria-label={`Include ${expense.label}`}
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`expense-${expense.id}`} className="block font-medium text-navy mb-2">
                  {expense.label}
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary-purple">
                      $
                    </span>
                    <input
                      id={`expense-${expense.id}`}
                      type="text"
                      value={expense.amount.toLocaleString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        updateExpense(expense.id, { amount: Number(value) || 0 })
                      }}
                      className="w-full pl-8 pr-4 py-2 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender disabled:opacity-50"
                      disabled={!expense.enabled}
                    />
                  </div>
                  <div className="text-sm text-navy/60 whitespace-nowrap">
                    {frequencyLabel}
                  </div>
                </div>
                {expense.enabled && (
                  <div className="mt-2 bg-light-blush rounded-lg h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-mauve-pink to-light-lavender h-full transition-all duration-300"
                      style={{ width: `${(expense.amount / maxExpense) * 100}%` }}
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
          <p className="text-sm text-navy mb-2">Total Annual Cost</p>
          <div className="text-4xl md:text-5xl font-bold text-primary-purple">
            {formatCurrency(total)}
          </div>
        </div>
      </div>
    </div>
  )
}
