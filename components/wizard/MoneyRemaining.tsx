'use client'

import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/lib/calculations'
import { SPENDING_MILESTONES } from '@/lib/constants'

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
  const [lastMilestone, setLastMilestone] = useState(0)
  const [showMilestoneMessage, setShowMilestoneMessage] = useState<string | null>(null)
  const confettiFired = useRef<Set<number>>(new Set())

  // Don't show on step 1 (before they've allocated anything)
  if (currentStep === 1) return null

  const allocated = debtsCleared + lifestyleDreams + invested
  const remaining = netTakeHome - allocated
  const percentUsed = Math.min((allocated / netTakeHome) * 100, 100)

  const isOverspent = remaining < 0
  const isFullyAllocated = percentUsed >= 99

  // Find current milestone
  const currentMilestone = SPENDING_MILESTONES.reduce((acc, milestone) => {
    if (percentUsed >= milestone.percent) return milestone
    return acc
  }, SPENDING_MILESTONES[0])

  // Fire confetti on milestone achievements
  useEffect(() => {
    const checkMilestones = async () => {
      for (const milestone of SPENDING_MILESTONES) {
        if (percentUsed >= milestone.percent && !confettiFired.current.has(milestone.percent)) {
          confettiFired.current.add(milestone.percent)

          // Show milestone message
          setShowMilestoneMessage(milestone.message)
          setTimeout(() => setShowMilestoneMessage(null), 3000)

          // Fire confetti at 100%
          if (milestone.percent === 100) {
            try {
              const confetti = (await import('canvas-confetti')).default
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#7A5980', '#BC7C9C', '#B375A0', '#ECD7D5', '#D8BFD8'],
              })
            } catch (e) {
              console.log('Confetti not available')
            }
          }
          break
        }
      }
    }

    checkMilestones()
  }, [percentUsed])

  return (
    <div className="mb-8 bg-gradient-to-r from-primary-purple to-light-lavender rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Milestone notification */}
      {showMilestoneMessage && (
        <div className="absolute top-0 left-0 right-0 bg-white/20 py-2 text-center animate-pulse">
          <span className="text-lg font-bold">{currentMilestone?.emoji} {showMilestoneMessage}</span>
        </div>
      )}

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

      {/* Progress bar with milestone markers */}
      <div className="mb-3 relative">
        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
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
        {/* Milestone markers */}
        <div className="absolute top-0 left-0 right-0 h-4 flex items-center">
          {SPENDING_MILESTONES.slice(0, -1).map((milestone) => (
            <div
              key={milestone.percent}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${milestone.percent}%` }}
            >
              <span
                className={`text-xs transition-all ${
                  percentUsed >= milestone.percent ? 'opacity-100 scale-125' : 'opacity-50'
                }`}
              >
                {milestone.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Percentage and milestone indicator */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm opacity-75">{Math.round(percentUsed)}% allocated</span>
        {currentMilestone && percentUsed >= currentMilestone.percent && (
          <span className="text-sm">
            {currentMilestone.emoji} {currentMilestone.message}
          </span>
        )}
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
            <p className="opacity-75">Dreams & Giving</p>
            <p className="font-semibold">{formatCurrency(lifestyleDreams)}</p>
          </div>
        )}
        {currentStep >= 7 && invested > 0 && (
          <div>
            <p className="opacity-75">Invested</p>
            <p className="font-semibold">{formatCurrency(invested)}</p>
          </div>
        )}
      </div>

      {isOverspent && (
        <p className="text-xs mt-3 opacity-90 italic">
          You're dreaming bigger than the jackpot! Consider adjusting your allocations.
        </p>
      )}
      {isFullyAllocated && !isOverspent && (
        <p className="text-xs mt-3 opacity-90 italic">
          🎊 You spent it ALL! Legend.
        </p>
      )}
    </div>
  )
}
