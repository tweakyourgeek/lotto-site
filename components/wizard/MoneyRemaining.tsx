'use client'

import { formatCurrency } from '@/lib/calculations'

interface MoneyRemainingProps {
  netTakeHome: number
  debtsCleared: number
  lifestyleDreams: number
  invested: number
  currentStep: number
}

export default function MoneyRemaining({
  netTakeHome,
  debtsCleared,
  lifestyleDreams,
  invested,
  currentStep,
}: MoneyRemainingProps) {
  // Don't show on step 1 (before they've allocated anything)
  if (currentStep === 1) return null

  const allocated = debtsCleared + lifestyleDreams + invested
  const remaining = netTakeHome - allocated
  const percentUsed = (allocated / netTakeHome) * 100

  const isOverspent = remaining < 0
  const isFullyAllocated = Math.abs(remaining) < 1000 // Within $1k = "perfect"

  return (
    <div className="mb-8 bg-gradient-to-r from-primary-purple to-light-lavender rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">Your Windfall</p>
          <p className="text-2xl font-bold">{formatCurrency(netTakeHome)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">
            {isOverspent ? 'Over Budget' : isFullyAllocated ? 'Fully Allocated!' : 'Remaining'}
          </p>
          <p className={`text-2xl font-bold ${isOverspent ? 'text-red-200' : isFullyAllocated ? 'text-green-200' : ''}`}>
            {isOverspent ? '-' : ''}{formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOverspent
                ? 'bg-red-300'
                : isFullyAllocated
                ? 'bg-green-300'
                : 'bg-white'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        {currentStep >= 2 && debtsCleared > 0 && (
          <div>
            <p className="opacity-75">Debts Cleared</p>
            <p className="font-semibold">{formatCurrency(debtsCleared)}</p>
          </div>
        )}
        {currentStep >= 3 && lifestyleDreams > 0 && (
          <div>
            <p className="opacity-75">Lifestyle</p>
            <p className="font-semibold">{formatCurrency(lifestyleDreams)}</p>
          </div>
        )}
        {currentStep >= 4 && invested > 0 && (
          <div>
            <p className="opacity-75">Invested</p>
            <p className="font-semibold">{formatCurrency(invested)}</p>
          </div>
        )}
      </div>

      {isOverspent && (
        <p className="text-xs mt-3 opacity-90 italic">
          You're dreaming big! Consider adjusting your allocations.
        </p>
      )}
      {isFullyAllocated && (
        <p className="text-xs mt-3 opacity-90 italic">
          Perfect! You've allocated every dollar.
        </p>
      )}
    </div>
  )
}
