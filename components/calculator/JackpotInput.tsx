'use client'

import { formatCurrency, formatNumber } from '@/lib/calculations'
import { STATE_TAX_RATES } from '@/lib/constants'

interface JackpotInputProps {
  jackpot: number
  onJackpotChange: (value: number) => void
  state: string
  onStateChange: (value: string) => void
  payoutType: 'lump-sum' | 'annuity'
  onPayoutTypeChange: (value: 'lump-sum' | 'annuity') => void
  filingStatus: string
  onFilingStatusChange: (value: string) => void
  netTakeHome: number
}

export default function JackpotInput({
  jackpot,
  onJackpotChange,
  state,
  onStateChange,
  payoutType,
  onPayoutTypeChange,
  filingStatus,
  onFilingStatusChange,
  netTakeHome,
}: JackpotInputProps) {
  const handleJackpotInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    onJackpotChange(Number(value) || 0)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-purple mb-4">
          The Lottery Reality Check
        </h1>
        <p className="text-lg md:text-xl text-navy">
          What would YOU do with a billion dollars?
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <label htmlFor="jackpot" className="block text-sm font-medium text-navy mb-2">
          Jackpot Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-primary-purple font-bold">
            $
          </span>
          <input
            id="jackpot"
            type="text"
            value={formatNumber(jackpot)}
            onChange={handleJackpotInput}
            className="w-full pl-10 pr-4 py-4 text-3xl md:text-4xl font-bold text-primary-purple border-2 border-dusty-rose rounded-xl focus:outline-none focus:ring-2 focus:ring-light-lavender"
            aria-label="Jackpot amount in dollars"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label htmlFor="payout-type" className="block text-sm font-medium text-navy mb-2">
              Payout Type
            </label>
            <select
              id="payout-type"
              value={payoutType}
              onChange={(e) => onPayoutTypeChange(e.target.value as 'lump-sum' | 'annuity')}
              className="w-full px-4 py-3 border-2 border-dusty-rose rounded-xl focus:outline-none focus:ring-2 focus:ring-light-lavender"
            >
              <option value="lump-sum">Lump Sum</option>
              <option value="annuity">Annuity</option>
            </select>
          </div>

          <div>
            <label htmlFor="filing-status" className="block text-sm font-medium text-navy mb-2">
              Filing Status
            </label>
            <select
              id="filing-status"
              value={filingStatus}
              onChange={(e) => onFilingStatusChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-dusty-rose rounded-xl focus:outline-none focus:ring-2 focus:ring-light-lavender"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="head-of-household">Head of Household</option>
            </select>
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-navy mb-2">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-dusty-rose rounded-xl focus:outline-none focus:ring-2 focus:ring-light-lavender"
            >
              {Object.keys(STATE_TAX_RATES).sort().map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-navy mb-2">Your Net Take-Home</p>
          <div className="text-5xl md:text-6xl font-bold text-primary-purple">
            {formatCurrency(netTakeHome)}
          </div>
        </div>

      </div>
    </div>
  )
}
