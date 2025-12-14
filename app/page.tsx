'use client'

import { useState, useEffect, useRef } from 'react'
import JackpotInput from '@/components/calculator/JackpotInput'
import DebtSection from '@/components/calculator/DebtSection'
import LifestyleSection from '@/components/calculator/LifestyleSection'
import InvestmentSection from '@/components/calculator/InvestmentSection'
import SummaryDashboard from '@/components/charts/SummaryDashboard'
import DreamLifeCost from '@/components/calculator/DreamLifeCost'
import EmailGate from '@/components/calculator/EmailGate'
import RealityCheck from '@/components/calculator/RealityCheck'
import { calculateNetTakeHome, calculateProjections } from '@/lib/calculations'
import { DEFAULT_DEBTS, DEFAULT_LIFESTYLE } from '@/lib/constants'
import type { Debt } from '@/components/calculator/DebtSection'
import type { LifestyleItem } from '@/components/calculator/LifestyleSection'

export default function Home() {
  const [jackpot, setJackpot] = useState(1000000000)
  const [state, setState] = useState('Washington')
  const [payoutType, setPayoutType] = useState<'lump-sum' | 'annuity'>('lump-sum')
  const [filingStatus, setFilingStatus] = useState('single')
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS)
  const [lifestyleItems, setLifestyleItems] = useState<LifestyleItem[]>(DEFAULT_LIFESTYLE)
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)

  const dreamLifeRef = useRef<HTMLDivElement>(null)

  const taxCalc = calculateNetTakeHome(jackpot, state, payoutType)
  const debtsCleared = debts.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const lifestyleDreams = lifestyleItems.reduce((sum, item) => sum + item.amount, 0)

  // Auto-set investment to 50% of net take-home
  useEffect(() => {
    const defaultInvestment = Math.floor(taxCalc.netTakeHome * 0.5)
    setInvestmentAmount(defaultInvestment)
  }, [taxCalc.netTakeHome])

  const projections = calculateProjections(investmentAmount, annualReturn)

  // Track scroll to show email gate after viewing all content
  useEffect(() => {
    const handleScroll = () => {
      if (dreamLifeRef.current && !hasScrolledToEnd) {
        const rect = dreamLifeRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setHasScrolledToEnd(true)
          // Show email gate after 2 seconds of viewing the dream life section
          setTimeout(() => setShowEmailGate(true), 2000)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolledToEnd])

  // Track analytics
  useEffect(() => {
    const timer = setTimeout(() => {
      trackAnalytics()
    }, 1000) // Debounce analytics tracking

    return () => clearTimeout(timer)
  }, [jackpot, state, debts, lifestyleItems, investmentAmount])

  const trackAnalytics = async () => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jackpot,
          state,
          payoutType,
          debtsCleared,
          lifestyleDreams,
          investmentAmount,
          debts: debts.filter((d) => d.enabled).map((d) => ({ id: d.id, amount: d.amount })),
          lifestyle: lifestyleItems.map((l) => ({ id: l.id, amount: l.amount })),
        }),
      })
    } catch (error) {
      // Silent fail - don't interrupt user experience
      console.error('Analytics tracking failed:', error)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          data: {
            jackpot,
            netTakeHome: taxCalc.netTakeHome,
            state,
            payoutType,
            debts: debts.filter((d) => d.enabled),
            lifestyleItems,
            investmentAmount,
            annualReturn,
            debtsCleared,
            lifestyleDreams,
            projections,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      // Generate and download PDF
      const pdfResponse = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jackpot,
          netTakeHome: taxCalc.netTakeHome,
          state,
          debts: debts.filter((d) => d.enabled),
          lifestyleItems,
          investmentAmount,
          annualReturn,
          debtsCleared,
          lifestyleDreams,
        }),
      })

      if (pdfResponse.ok) {
        const blob = await pdfResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'lottery-reality-check.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      setShowEmailGate(false)
      alert('Check your email! Your personalized report is on its way.')
    } catch (error) {
      throw error
    }
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <JackpotInput
          jackpot={jackpot}
          onJackpotChange={setJackpot}
          state={state}
          onStateChange={setState}
          payoutType={payoutType}
          onPayoutTypeChange={setPayoutType}
          filingStatus={filingStatus}
          onFilingStatusChange={setFilingStatus}
          netTakeHome={taxCalc.netTakeHome}
        />

        <DebtSection debts={debts} onDebtsChange={setDebts} />

        <LifestyleSection items={lifestyleItems} onItemsChange={setLifestyleItems} />

        <InvestmentSection
          defaultAmount={investmentAmount}
          onInvestmentChange={(amount, returnRate) => {
            setInvestmentAmount(amount)
            setAnnualReturn(returnRate)
          }}
        />

        <SummaryDashboard
          netTakeHome={taxCalc.netTakeHome}
          debtsCleared={debtsCleared}
          lifestyleDreams={lifestyleDreams}
          invested={investmentAmount}
          projections={projections}
        />

        <div ref={dreamLifeRef}>
          <DreamLifeCost lifestyleDreams={lifestyleDreams} />
        </div>

        <RealityCheck />

        <footer className="text-center py-8 text-sm text-navy/60">
          <p className="mb-2">
            Built with ❤️ by{' '}
            <a
              href="https://tweakyourgeek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-purple hover:underline"
            >
              Tweak Your Geek
            </a>
          </p>
          <p>
            Data based on{' '}
            <a
              href="https://www.usamega.com/powerball/jackpot"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary-purple"
            >
              usamega.com
            </a>{' '}
            (established 1999)
          </p>
        </footer>
      </div>

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSubmit={handleEmailSubmit}
      />
    </main>
  )
}
