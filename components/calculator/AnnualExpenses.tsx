'use client'

import { formatCurrency } from '@/lib/calculations'

export interface AnnualExpense {
  id: string
  label: string
  amount: number
}

interface AnnualExpensesProps {
  expenses: AnnualExpense[]
  onExpensesChange: (expenses: AnnualExpense[]) => void
}

export default function AnnualExpenses({ expenses, onExpensesChange }: AnnualExpensesProps) {
  const totalAnnual = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const maxExpense = Math.max(...expenses.map((e) => e.amount))

  const updateExpense = (id: string, amount: number) => {
    onExpensesChange(
      expenses.map((exp) => (exp.id === id ? { ...exp, amount } : exp))
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-4 hidden md:block">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          Your Annual Lifestyle
        </h2>
        <p className="text-lg text-navy">What does it cost to live your dream life each year?</p>
      </div>
      <div className="mb-4 md:hidden">
        <p className="text-lg text-navy">What does it cost to live your dream life each year?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="border-b border-light-blush pb-3">
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
                    updateExpense(expense.id, Number(value) || 0)
                  }}
                  className="w-full pl-8 pr-4 py-2 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
                />
              </div>
              <div className="text-sm text-navy/60 whitespace-nowrap">
                per year
              </div>
            </div>
            <div className="mt-2 bg-light-blush rounded-lg h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-mauve-pink to-light-lavender h-full transition-all duration-300"
                style={{ width: `${(expense.amount / maxExpense) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-dusty-rose md:col-span-2">
        <div className="text-center">
          <p className="text-sm text-navy mb-2">Total Annual Expenses</p>
          <div className="text-4xl md:text-5xl font-bold text-primary-purple">
            {formatCurrency(totalAnnual)}
          </div>
          <p className="text-lg text-mauve-pink mt-3 italic">
            This is what your dream life costs to maintain.
          </p>
        </div>
      </div>
    </div>
  )
}
