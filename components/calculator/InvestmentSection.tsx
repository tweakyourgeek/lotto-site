'use client'

import { useState } from 'react'
import { formatCurrency, calculateInvestmentGrowth } from '@/lib/calculations'

interface InvestmentSectionProps {
  defaultAmount: number
  onInvestmentChange: (amount: number, annualReturn: number) => void
}

export default function InvestmentSection({
  defaultAmount,
  onInvestmentChange,
}: InvestmentSectionProps) {
  const [investmentAmount, setInvestmentAmount] = useState(defaultAmount)
  const [annualReturn, setAnnualReturn] = useState(7)

  const value10Years = calculateInvestmentGrowth(investmentAmount, annualReturn, 10)
  const value30Years = calculateInvestmentGrowth(investmentAmount, annualReturn, 30)

  const handleAmountChange = (value: number) => {
    setInvestmentAmount(value)
    onInvestmentChange(value, annualReturn)
  }

  const handleReturnChange = (value: number) => {
    setAnnualReturn(value)
    onInvestmentChange(investmentAmount, value)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          The Future
        </h2>
        <p className="text-lg text-navy">Let time do the heavy lifting</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="investment-amount" className="block font-medium text-navy mb-2">
            Amount Invested
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary-purple">
              $
            </span>
            <input
              id="investment-amount"
              type="text"
              value={investmentAmount.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                handleAmountChange(Number(value) || 0)
              }}
              className="w-full pl-8 pr-4 py-3 text-lg font-semibold border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender"
            />
          </div>
          <p className="text-sm text-navy/60 mt-1">
            Suggested: 50% of your net take-home
          </p>
        </div>

        <div>
          <label htmlFor="annual-return" className="block font-medium text-navy mb-2">
            Annual Return: {annualReturn}%
          </label>
          <input
            id="annual-return"
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={annualReturn}
            onChange={(e) => handleReturnChange(Number(e.target.value))}
            className="w-full h-3 bg-light-blush rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-purple [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-purple [&::-moz-range-thumb]:border-0"
          />
          <div className="flex justify-between text-xs text-navy/60 mt-1">
            <span>Conservative (4%)</span>
            <span>Aggressive (12%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-light-blush rounded-xl p-6 text-center">
            <p className="text-sm text-navy mb-2">In 10 Years</p>
            <div className="text-3xl font-bold text-primary-purple">
              {formatCurrency(value10Years)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-light-lavender to-dusty-rose rounded-xl p-6 text-center">
            <p className="text-sm text-white mb-2">In 30 Years</p>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(value30Years)}
            </div>
          </div>
        </div>

        <p className="text-center text-lg text-mauve-pink italic mt-6">
          Time does the heavy lifting. You just have to let it.
        </p>
      </div>
    </div>
  )
}
