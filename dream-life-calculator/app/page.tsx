'use client'

import { useState } from 'react'
import CostBreakdown from '@/components/CostBreakdown'
import ExpenseInput from '@/components/ExpenseInput'
import EmailCapture from '@/components/EmailCapture'
import { DEFAULT_RECURRING_EXPENSES, DEFAULT_ONEOFF_EXPENSES, PRESETS } from '@/lib/constants'
import { formatCurrency } from '@/lib/calculations'
import type { DreamExpense } from '@/lib/constants'

type PresetKey = 'comfortable' | 'ambitious' | 'dream' | 'custom'

export default function DreamLifeCalculator() {
  const [recurringExpenses, setRecurringExpenses] = useState<DreamExpense[]>(DEFAULT_RECURRING_EXPENSES)
  const [oneOffExpenses, setOneOffExpenses] = useState<DreamExpense[]>(DEFAULT_ONEOFF_EXPENSES)
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('custom')
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [amortizeYears] = useState(5)

  const totalRecurring = recurringExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalOneOff = oneOffExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0)

  const amortizedOneOff = totalOneOff / amortizeYears
  const totalAnnual = totalRecurring + amortizedOneOff

  const applyPreset = (key: PresetKey) => {
    setSelectedPreset(key)
    if (key === 'custom') return

    const preset = PRESETS[key]
    setRecurringExpenses(
      DEFAULT_RECURRING_EXPENSES.map((exp) => {
        const override = preset.recurringOverrides.find((o) => o.id === exp.id)
        return override
          ? { ...exp, amount: override.amount, enabled: override.enabled }
          : { ...exp, enabled: exp.enabled }
      })
    )
  }

  const handleEmailSubmit = async (email: string) => {
    // TODO: wire up email API
    console.log('Email submitted:', email)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-purple mb-4">
            What Does Your Dream Life Cost?
          </h1>
          <p className="text-xl text-navy/80 max-w-2xl mx-auto">
            Figure out the real numbers — and the income you need to make it happen.
          </p>
        </div>

        {/* Presets */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary-purple mb-4 text-center">
            Quick Start
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'comfortable' as PresetKey, emoji: '🧘', label: 'Comfortable', desc: 'Secure and stress-free' },
              { key: 'ambitious' as PresetKey, emoji: '🚀', label: 'Ambitious', desc: 'Living well, saving hard' },
              { key: 'dream' as PresetKey, emoji: '✨', label: 'Dream Big', desc: 'No compromises' },
              { key: 'custom' as PresetKey, emoji: '🔧', label: 'Custom', desc: 'Build your own' },
            ].map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedPreset === preset.key
                    ? 'border-primary-purple bg-primary-purple/10'
                    : 'border-light-blush hover:border-dusty-rose'
                }`}
              >
                <div className="text-2xl mb-1">{preset.emoji}</div>
                <div className="font-semibold text-navy text-sm">{preset.label}</div>
                <div className="text-xs text-navy/60">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recurring Expenses */}
        <ExpenseInput
          title="Your Monthly Reality"
          subtitle="What does your dream life cost each year?"
          expenses={recurringExpenses}
          onExpensesChange={(expenses) => {
            setRecurringExpenses(expenses)
            setSelectedPreset('custom')
          }}
        />

        {/* One-Time Purchases */}
        <ExpenseInput
          title="Big Purchases"
          subtitle="Any one-time expenses in the next few years?"
          expenses={oneOffExpenses}
          onExpensesChange={(expenses) => {
            setOneOffExpenses(expenses)
            setSelectedPreset('custom')
          }}
          frequencyLabel="one-time"
        />

        {/* Amortization note */}
        {totalOneOff > 0 && (
          <div className="bg-white rounded-xl p-4 text-center text-sm text-navy/70">
            One-time purchases ({formatCurrency(totalOneOff)}) spread over {amortizeYears} years = {formatCurrency(amortizedOneOff)}/year added to your total
          </div>
        )}

        {/* Cost Breakdown */}
        <CostBreakdown totalAnnualExpenses={totalAnnual} />

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-purple mb-3">
            Now You Know the Number
          </h2>
          <p className="text-navy/80 mb-6 max-w-xl mx-auto">
            Your dream life costs {formatCurrency(totalAnnual)} per year. Save your plan and start building toward it.
          </p>
          <button
            onClick={() => setShowEmailCapture(true)}
            className="px-8 py-4 bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
          >
            Get My Dream Life Plan
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-navy/60 mt-6">
          <p className="mb-2">
            Built with <span className="text-primary-purple">❤️</span> by{' '}
            <a
              href="https://tweakyourgeek.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-purple hover:underline"
            >
              Tweak Your Geek
            </a>
          </p>
          <p className="text-xs text-navy/40 mt-2">
            This is a planning tool, not financial advice. Always consult professionals for personalized guidance.
          </p>
        </footer>
      </div>

      <EmailCapture
        isOpen={showEmailCapture}
        onClose={() => setShowEmailCapture(false)}
        onSubmit={handleEmailSubmit}
        onPrint={handlePrint}
      />
    </main>
  )
}
