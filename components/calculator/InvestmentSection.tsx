'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, calculateInvestmentGrowth } from '@/lib/calculations'

interface InvestmentSectionProps {
  defaultAmount: number
  remainingMoney: number
  annualExpenses: number
  onInvestmentChange: (amount: number, annualReturn: number) => void
}

export default function InvestmentSection({
  defaultAmount,
  remainingMoney,
  annualExpenses,
  onInvestmentChange,
}: InvestmentSectionProps) {
  const [investmentAmount, setInvestmentAmount] = useState(defaultAmount)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [investAll, setInvestAll] = useState(false)

  // Sync with defaultAmount changes
  useEffect(() => {
    if (defaultAmount > 0 && investmentAmount === 0) {
      setInvestmentAmount(defaultAmount)
    }
  }, [defaultAmount])

  // Calculate projections with and without withdrawals
  const value10YearsNoWithdrawals = calculateInvestmentGrowth(investmentAmount, annualReturn, 10)
  const value30YearsNoWithdrawals = calculateInvestmentGrowth(investmentAmount, annualReturn, 30)

  // With annual withdrawals
  const value10YearsWithWithdrawals = calculateInvestmentGrowthWithdrawals(
    investmentAmount,
    annualReturn,
    annualExpenses,
    10
  )
  const value30YearsWithWithdrawals = calculateInvestmentGrowthWithdrawals(
    investmentAmount,
    annualReturn,
    annualExpenses,
    30
  )

  const handleAmountChange = (value: number) => {
    setInvestmentAmount(value)
    setInvestAll(false)
    onInvestmentChange(value, annualReturn)
  }

  const handleReturnChange = (value: number) => {
    setAnnualReturn(value)
    onInvestmentChange(investmentAmount, value)
  }

  const handleInvestAllChange = (checked: boolean) => {
    setInvestAll(checked)
    if (checked) {
      const newAmount = investmentAmount + remainingMoney
      setInvestmentAmount(newAmount)
      onInvestmentChange(newAmount, annualReturn)
    }
  }

  // Calculate how much they earn annually vs spend
  const annualEarnings = investmentAmount * (annualReturn / 100)
  const netAnnualGain = annualEarnings - annualExpenses
  const willRunOut = netAnnualGain < 0

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-4 hidden md:block">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          The Future
        </h2>
        <p className="text-lg text-navy">Let time do the heavy lifting</p>
      </div>
      <div className="mb-4 md:hidden">
        <p className="text-lg text-navy">Let time do the heavy lifting</p>
      </div>

      {remainingMoney > 1000 && !investAll && (
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <p className="text-sm font-semibold text-yellow-900 mb-2">
            You have {formatCurrency(remainingMoney)} not allocated yet!
          </p>
          <p className="text-sm text-yellow-800">
            Check the box below to invest it, or go back to add more lifestyle items.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-light-blush rounded-lg">
          <input
            type="checkbox"
            id="invest-all"
            checked={investAll}
            onChange={(e) => handleInvestAllChange(e.target.checked)}
            className="w-5 h-5 text-primary-purple border-dusty-rose rounded focus:ring-2 focus:ring-light-lavender"
          />
          <label htmlFor="invest-all" className="font-semibold text-navy cursor-pointer">
            {investAll
              ? '✓ Investing all remaining funds'
              : `Invest all remaining funds ${remainingMoney > 0 ? `(${formatCurrency(remainingMoney)})` : ''}`
            }
          </label>
        </div>

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
        </div>

        <div>
          <label htmlFor="annual-return" className="block font-medium text-navy mb-2">
            Annual Return: {annualReturn}%
          </label>
          <input
            id="annual-return"
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={annualReturn}
            onChange={(e) => handleReturnChange(Number(e.target.value))}
            className="w-full h-3 bg-light-blush rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-purple [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-purple [&::-moz-range-thumb]:border-0"
          />
          <div className="flex justify-between text-xs text-navy/60 mt-1">
            <span>Conservative (1%)</span>
            <span>Aggressive (12%)</span>
          </div>
        </div>

        {investmentAmount > 0 && annualExpenses > 0 && (
          <div className="p-4 bg-gradient-to-r from-primary-purple/10 to-light-lavender/10 rounded-lg border border-primary-purple/20">
            <p className="text-sm font-semibold text-navy mb-2">The Math:</p>
            <div className="text-sm text-navy space-y-1">
              <p>• At {annualReturn}% return on {formatCurrency(investmentAmount)}, you earn <strong>{formatCurrency(annualEarnings)}/year</strong></p>
              <p>• Your annual expenses are <strong>{formatCurrency(annualExpenses)}</strong></p>
              <p className={willRunOut ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                • {willRunOut
                  ? `⚠️ You're spending ${formatCurrency(Math.abs(netAnnualGain))} more than you earn!`
                  : `✓ Your money grows by ${formatCurrency(netAnnualGain)}/year!`
                }
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">If you never touch your investments:</h3>
            <div className="bg-light-blush rounded-xl p-3">
              <p className="text-xs text-navy mb-1">In 10 Years</p>
              <div className="text-2xl font-bold text-primary-purple">
                {formatCurrency(value10YearsNoWithdrawals)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-light-lavender to-dusty-rose rounded-xl p-3">
              <p className="text-xs text-white mb-1">In 30 Years</p>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(value30YearsNoWithdrawals)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">If you withdraw {formatCurrency(annualExpenses)}/year:</h3>
            <div className="bg-light-blush rounded-xl p-3">
              <p className="text-xs text-navy mb-1">In 10 Years</p>
              <div className="text-2xl font-bold text-primary-purple">
                {formatCurrency(Math.max(0, value10YearsWithWithdrawals))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-purple to-navy rounded-xl p-3">
              <p className="text-xs text-white mb-1">In 30 Years</p>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(Math.max(0, value30YearsWithWithdrawals))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-base text-mauve-pink italic mt-4">
          Time does the heavy lifting. You just have to let it.
        </p>
      </div>
    </div>
  )
}

// Helper function to calculate growth with annual withdrawals
function calculateInvestmentGrowthWithdrawals(
  principal: number,
  annualReturn: number,
  annualWithdrawal: number,
  years: number
): number {
  let balance = principal
  for (let year = 0; year < years; year++) {
    balance = balance * (1 + annualReturn / 100) - annualWithdrawal
    if (balance < 0) return 0 // Ran out of money
  }
  return balance
}
