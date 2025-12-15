'use client'

import { useState, useEffect, useRef } from 'react'
import JackpotInput from '@/components/calculator/JackpotInput'
import DebtSection from '@/components/calculator/DebtSection'
import LifestyleSection from '@/components/calculator/LifestyleSection'
import AnnualExpenses from '@/components/calculator/AnnualExpenses'
import InvestmentSection from '@/components/calculator/InvestmentSection'
import SummaryDashboard from '@/components/charts/SummaryDashboard'
import DreamLifeCost from '@/components/calculator/DreamLifeCost'
import EmailGate from '@/components/calculator/EmailGate'
import RealityCheck from '@/components/calculator/RealityCheck'
import ProgressIndicator from '@/components/wizard/ProgressIndicator'
import WizardNavigation from '@/components/wizard/WizardNavigation'
import MoneyRemaining from '@/components/wizard/MoneyRemaining'
import StartOverButton from '@/components/wizard/StartOverButton'
import { calculateNetTakeHome, calculateProjections } from '@/lib/calculations'
import { DEFAULT_DEBTS, DEFAULT_LIFESTYLE, DEFAULT_ANNUAL_EXPENSES } from '@/lib/constants'
import { saveWizardData, loadWizardData, clearWizardData } from '@/lib/storage'
import type { Debt } from '@/components/calculator/DebtSection'
import type { LifestyleItem } from '@/components/calculator/LifestyleSection'
import type { AnnualExpense } from '@/components/calculator/AnnualExpenses'

const STEPS = [
  { number: 1, title: 'The Setup' },
  { number: 2, title: 'Clear the Deck' },
  { number: 3, title: 'Fun + Dreams' },
  { number: 4, title: 'Annual Lifestyle' },
  { number: 5, title: 'The Future' },
  { number: 6, title: 'Your Results' },
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
  const [annualExpenses, setAnnualExpenses] = useState<AnnualExpense[]>(DEFAULT_ANNUAL_EXPENSES)
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
    if (saved.annualExpenses) setAnnualExpenses(saved.annualExpenses)
    if (saved.investmentAmount) setInvestmentAmount(saved.investmentAmount)
    if (saved.annualReturn) setAnnualReturn(saved.annualReturn)
    setIsLoaded(true)
  }, [])

  const taxCalc = calculateNetTakeHome(jackpot, state, payoutType)
  const debtsCleared = debts.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const lifestyleDreams = lifestyleItems.reduce((sum, item) => sum + item.amount, 0)
  const totalAnnualExpenses = annualExpenses.reduce((sum, exp) => sum + exp.amount, 0)

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
      annualExpenses,
      investmentAmount,
      annualReturn,
    })
  }, [currentStep, visitedSteps, jackpot, state, payoutType, filingStatus, debts, lifestyleItems, annualExpenses, investmentAmount, annualReturn, isLoaded])

  // Track analytics
  useEffect(() => {
    if (!isLoaded) return

    const timer = setTimeout(() => {
      trackAnalytics()
    }, 1000)

    return () => clearTimeout(timer)
  }, [jackpot, state, debts, lifestyleItems, annualExpenses, investmentAmount, isLoaded])

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
            annualExpenses,
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
          annualExpenses,
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
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = () => {
    if (currentStep < 6) {
      goToStep(currentStep + 1)
    } else {
      setShowEmailGate(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    clearWizardData()
    setCurrentStep(1)
    setVisitedSteps([1])
    setJackpot(1000000000)
    setState('Washington')
    setPayoutType('lump-sum')
    setFilingStatus('single')
    setDebts(DEFAULT_DEBTS)
    setLifestyleItems(DEFAULT_LIFESTYLE)
    setAnnualExpenses(DEFAULT_ANNUAL_EXPENSES)
    setInvestmentAmount(0)
    setAnnualReturn(7)
    setShowEmailGate(false)
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stepsWithVisited = STEPS.map((step) => ({
    ...step,
    visited: visitedSteps.includes(step.number),
  }))

  return (
    <main className="min-h-screen py-4 md:py-8" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-7xl">
        <StartOverButton onStartOver={handleStartOver} />

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={6}
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
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <div className="md:hidden mb-4">
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
                  totalSteps={6}
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
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Clear the Deck</h2>
              </div>
              <DebtSection debts={debts} onDebtsChange={setDebts} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={6}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="Next: Dream Big →"
              />
            </div>
          )}

          {/* Step 3: Fun + Dreams */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Fun + Dreams</h2>
              </div>
              <LifestyleSection items={lifestyleItems} onItemsChange={setLifestyleItems} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={6}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="Next: Annual Lifestyle →"
              />
            </div>
          )}

          {/* Step 4: Annual Lifestyle */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Annual Lifestyle</h2>
              </div>
              <AnnualExpenses expenses={annualExpenses} onExpensesChange={setAnnualExpenses} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={6}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="Next: Invest for the Future →"
              />
            </div>
          )}

          {/* Step 5: The Future */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
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
                totalSteps={6}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel="See My Results →"
              />
            </div>
          )}

          {/* Step 6: Your Results */}
          {currentStep === 6 && (
            <div className="animate-fadeIn space-y-6">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Your Results</h2>
              </div>

              <SummaryDashboard
                netTakeHome={taxCalc.netTakeHome}
                debtsCleared={debtsCleared}
                lifestyleDreams={lifestyleDreams}
                invested={investmentAmount}
                projections={projections}
              />

              <DreamLifeCost annualExpenses={totalAnnualExpenses} />

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
                totalSteps={6}
                onBack={handleBack}
                onNext={() => setShowEmailGate(true)}
                nextLabel="Get My Report →"
              />
            </div>
          )}
        </div>

        <footer className="text-center py-6 text-sm text-navy/60 mt-6">
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
