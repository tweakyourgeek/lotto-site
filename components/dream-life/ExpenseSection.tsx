'use client'

import { formatCurrency } from '@/lib/calculations'
import type { DreamExpense } from '@/lib/constants'

interface ExpenseSectionProps {
  title: string
  subtitle: string
  expenses: DreamExpense[]
  onExpensesChange: (expenses: DreamExpense[]) => void
  emoji?: string
}

export default function ExpenseSection({
  title,
  subtitle,
  expenses,
  onExpensesChange,
  emoji,
}: ExpenseSectionProps) {
  const handleToggle = (id: string) => {
    onExpensesChange(
      expenses.map((exp) => (exp.id === id ? { ...exp, enabled: !exp.enabled } : exp))
    )
  }

  const handleAmountChange = (id: string, value: number) => {
    onExpensesChange(expenses.map((exp) => (exp.id === id ? { ...exp, amount: value } : exp)))
  }

  const handleFrequencyChange = (
    id: string,
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'once'
  ) => {
    onExpensesChange(expenses.map((exp) => (exp.id === id ? { ...exp, frequency } : exp)))
  }

  const calculateAnnual = (expense: DreamExpense) => {
    if (!expense.enabled) return 0
    const { amount, frequency } = expense

    switch (frequency) {
      case 'weekly':
        return amount * 52
      case 'monthly':
        return amount * 12
      case 'quarterly':
        return amount * 4
      case 'yearly':
      case 'once':
        return amount
      default:
        return 0
    }
  }

  const totalAnnual = expenses
    .filter((e) => e.enabled)
    .reduce((sum, exp) => sum + calculateAnnual(exp), 0)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-6">
        {emoji && <div className="text-5xl mb-2">{emoji}</div>}
        <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-2">{title}</h2>
        <p className="text-navy/70">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className={`border-2 rounded-xl p-4 transition-all ${
              expense.enabled
                ? 'border-primary-purple bg-light-blush/20'
                : 'border-dusty-rose/30 bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={expense.enabled}
                onChange={() => handleToggle(expense.id)}
                className="mt-1 w-5 h-5 text-primary-purple rounded focus:ring-2 focus:ring-light-lavender"
              />

              <div className="flex-1">
                <label className="font-semibold text-navy block mb-3">{expense.label}</label>

                {expense.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-navy/60 block mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-purple">
                          $
                        </span>
                        <input
                          type="number"
                          value={expense.amount}
                          onChange={(e) =>
                            handleAmountChange(expense.id, Number(e.target.value) || 0)
                          }
                          className="w-full pl-7 pr-3 py-2 border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-navy/60 block mb-1">Frequency</label>
                      <select
                        value={expense.frequency}
                        onChange={(e) =>
                          handleFrequencyChange(
                            expense.id,
                            e.target.value as DreamExpense['frequency']
                          )
                        }
                        className="w-full px-3 py-2 border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="once">One-time</option>
                      </select>
                    </div>
                  </div>
                )}

                {expense.enabled && (
                  <div className="mt-2 text-sm text-primary-purple font-semibold">
                    = {formatCurrency(calculateAnnual(expense))} per year
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t-2 border-light-blush">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-navy">Category Total</span>
          <span className="text-2xl font-bold text-primary-purple">
            {formatCurrency(totalAnnual)}/year
          </span>
        </div>
      </div>
    </div>
  )
}
