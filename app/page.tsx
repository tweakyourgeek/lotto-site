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
import ProgressIndicator from '@/components/wizard/ProgressIndicator'
import WizardNavigation from '@/components/wizard/WizardNavigation'
import MoneyRemaining from '@/components/wizard/MoneyRemaining'
import { calculateNetTakeHome, calculateProjections } from '@/lib/calculations'
import { DEFAULT_DEBTS, DEFAULT_LIFESTYLE } from '@/lib/constants'
import { saveWizardData, loadWizardData } from '@/lib/storage'
import type { Debt } from '@/components/calculator/DebtSection'
import type { LifestyleItem } from '@/components/calculator/LifestyleSection'

const STEPS = [
  { number: 1, title: 'The Setup' },
  { number: 2, title: 'Clear the Deck' },
  { number: 3, title: 'Fun + Dreams' },
  { number: 4, title: 'The Future' },
  { number: 5, title: 'Your Results' },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  const [jackpot, setJackpot] = useState(1000000000)
  const [state, setState] = useState('Washington')
  const [payoutType, setPayoutType] = useState<'lump-sum' | 'annuity'>('lump-sum')
  const [filingStatus, setFilingStatus] = useState('single')
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS)
  const [lifestyleItems, setLifestyleItems] = useState<LifestyleItem[]>(DEFAULT_LIFESTYLE)
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Load saved data on mount
  useEffect(() => {
    const saved = loadWizardData()
    if (saved.currentStep) setCurrentStep(saved.currentStep)
    if (saved.visitedSteps) setVisitedSteps(saved.visitedSteps)
    if (saved.jackpot) setJackpot(saved.jackpot)
    if (saved.state) setState(saved.state)
    if (saved.payoutType) setPayoutType(saved.payoutType)
    if (saved.filingStatus) setFilingStatus(saved.filingStatus)
    if (saved.debts) setDebts(saved.debts)
    if (saved.lifestyleItems) setLifestyleItems(saved.lifestyleItems)
    if (saved.investmentAmount) setInvestmentAmount(saved.investmentAmount)
    if (saved.annualReturn) setAnnualReturn(saved.annualReturn)
    setIsLoaded(true)
  }, [])

  const taxCalc = calculateNetTakeHome(jackpot, state, payoutType)
  const debtsCleared = debts.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const lifestyleDreams = lifestyleItems.reduce((sum, item) => sum + item.amount, 0)

  // Auto-set investment to 50% of net take-home
  useEffect(() => {
    if (isLoaded && investmentAmount === 0) {
      const defaultInvestment = Math.floor(taxCalc.netTakeHome * 0.5)
      setInvestmentAmount(defaultInvestment)
    }
  }, [taxCalc.netTakeHome, isLoaded, investmentAmount])

  const projections = calculateProjections(investmentAmount, annualReturn)

  // Save data on changes
  useEffect(() => {
    if (!isLoaded) return
    saveWizardData({
      currentStep,
      visitedSteps,
      jackpot,
      state,
      payoutType,
      filingStatus,
      debts,
      lifestyleItems,
      investmentAmount,
      annualReturn,
    })
  }, [currentStep, visitedSteps, jackpot, state, payoutType, filingStatus, debts, lifestyleItems, investmentAmount, annualReturn, isLoaded])

  // Track analytics
  useEffect(() => {
    if (!isLoaded) return

    const timer = setTimeout(() => {
      trackAnalytics()
    }, 1000)

    return () => clearTimeout(timer)
  }, [jackpot, state, debts, lifestyleItems, investmentAmount, isLoaded])

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

  const goToStep = (step: number) => {
    setCurrentStep(step)
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step])
    }
    // Scroll to top
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = () => {
    if (currentStep < 5) {
      goToStep(currentStep + 1)
    } else {
      // On final step, show email gate
      setShowEmailGate(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const stepsWithVisited = STEPS.map((step) => ({
    ...step,
    visited: visitedSteps.includes(step.number),
  }))

  return (
    <main className="min-h-screen py-8 md:py-12" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-4xl">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={5}
          steps={stepsWithVisited}
          onStepClick={goToStep}
        />

        <MoneyRemaining
          netTakeHome={taxCalc.netTakeHome}
          debtsCleared={debtsCleared}
          lifestyleDreams={lifestyleDreams}
          invested={investmentAmount}
          currentStep={currentStep}
        />

        <div className="transition-all duration-300 ease-in-out">
          {/* Step 1: The Setup */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="md:hidden mb-6">
                  <h2 className="text-3xl font-bold text-primary-purple">The Setup</h2>
                </div>
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
                <WizardNavigation
                  currentStep={currentStep}
                  totalSteps={5}
                  onBack={handleBack}
                  onNext={handleNext}
                  nextLabel="Next: Clear Your Debts →"
                />
              </div>
            </div>
          )}

          {/* Step 2: Clear the Deck */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-6 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Clear the Deck</h2>
              </div>
              <DebtSection debts={debts} onDebtsChange={setDebts} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={5}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="Next: Dream Big →"
              />
            </div>
          )}

          {/* Step 3: Fun + Dreams */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-6 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Fun + Dreams</h2>
              </div>
              <LifestyleSection items={lifestyleItems} onItemsChange={setLifestyleItems} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={5}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="Next: Invest for the Future →"
              />
            </div>
          )}

          {/* Step 4: The Future */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-6 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">The Future</h2>
              </div>
              <InvestmentSection
                defaultAmount={investmentAmount}
                onInvestmentChange={(amount, returnRate) => {
                  setInvestmentAmount(amount)
                  setAnnualReturn(returnRate)
                }}
              />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={5}
                onBack={handleBack}
                onNext={handleNext}
                isLastStep={true}
              />
            </div>
          )}

          {/* Step 5: Your Results */}
          {currentStep === 5 && (
            <div className="animate-fadeIn space-y-8">
              <div className="md:hidden mb-6 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Your Results</h2>
              </div>

              <SummaryDashboard
                netTakeHome={taxCalc.netTakeHome}
                debtsCleared={debtsCleared}
                lifestyleDreams={lifestyleDreams}
                invested={investmentAmount}
                projections={projections}
              />

              <DreamLifeCost lifestyleDreams={lifestyleDreams} />

              <RealityCheck />

              <div className="text-center">
                <button
                  onClick={() => setShowEmailGate(true)}
                  className="px-8 py-4 bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold rounded-lg hover:shadow-xl transition-all text-lg"
                >
                  Get My Personalized Report
                </button>
              </div>

              <WizardNavigation
                currentStep={currentStep}
                totalSteps={5}
                onBack={handleBack}
                onNext={() => setShowEmailGate(true)}
                nextLabel="Get My Report →"
              />
            </div>
          )}
        </div>

        <footer className="text-center py-8 text-sm text-navy/60 mt-8">
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
