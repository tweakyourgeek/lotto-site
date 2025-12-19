'use client'

import { useState, useEffect, useRef } from 'react'
import JackpotInput from '@/components/calculator/JackpotInput'
import DebtSection from '@/components/calculator/DebtSection'
import SpendingSection from '@/components/calculator/SpendingSection'
import PresetSelector from '@/components/calculator/PresetSelector'
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
import {
  DEFAULT_DEBTS,
  DEFAULT_DOMICILES,
  DEFAULT_TRAVEL_TOYS,
  DEFAULT_SHARE_WEALTH,
  DEFAULT_ANNUAL_EXPENSES,
  PRESETS,
  PresetType,
} from '@/lib/constants'
import { saveWizardData, loadWizardData, clearWizardData } from '@/lib/storage'
import type { Debt } from '@/components/calculator/DebtSection'
import type { SpendingItem } from '@/components/calculator/SpendingSection'
import type { AnnualExpense } from '@/components/calculator/AnnualExpenses'

const STEPS = [
  { number: 1, title: 'The Setup' },
  { number: 2, title: 'Clear the Deck' },
  { number: 3, title: 'Domiciles' },
  { number: 4, title: 'Luxury & Travel' },
  { number: 5, title: 'Share the Wealth' },
  { number: 6, title: 'Your New Normal' },
  { number: 7, title: 'The Future' },
  { number: 8, title: 'Your Results' },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  const [jackpot, setJackpot] = useState(1500000000) // Start with current jackpot!
  const [state, setState] = useState('Washington')
  const [payoutType, setPayoutType] = useState<'lump-sum' | 'annuity'>('lump-sum')
  const [filingStatus, setFilingStatus] = useState('single')
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('custom')
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS)
  const [domiciles, setDomiciles] = useState<SpendingItem[]>(DEFAULT_DOMICILES)
  const [travelToys, setTravelToys] = useState<SpendingItem[]>(DEFAULT_TRAVEL_TOYS)
  const [shareWealth, setShareWealth] = useState<SpendingItem[]>(DEFAULT_SHARE_WEALTH)
  const [annualExpenses, setAnnualExpenses] = useState<AnnualExpense[]>(DEFAULT_ANNUAL_EXPENSES)
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Apply preset values
  const applyPreset = (preset: PresetType) => {
    setSelectedPreset(preset)

    if (preset === 'custom') return

    const presetData = PRESETS[preset]

    // Apply domiciles
    setDomiciles(
      DEFAULT_DOMICILES.map((item) => {
        const presetItem = presetData.domiciles.find((p) => p.id === item.id)
        return presetItem
          ? { ...item, amount: presetItem.amount, enabled: presetItem.enabled }
          : item
      })
    )

    // Apply travel & toys
    setTravelToys(
      DEFAULT_TRAVEL_TOYS.map((item) => {
        const presetItem = presetData.travelToys.find((p) => p.id === item.id)
        return presetItem
          ? { ...item, amount: presetItem.amount, enabled: presetItem.enabled }
          : item
      })
    )

    // Apply share the wealth
    setShareWealth(
      DEFAULT_SHARE_WEALTH.map((item) => {
        const presetItem = presetData.shareWealth.find((p) => p.id === item.id)
        return presetItem
          ? { ...item, amount: presetItem.amount, enabled: presetItem.enabled }
          : item
      })
    )

    // Apply annual expenses
    setAnnualExpenses(
      DEFAULT_ANNUAL_EXPENSES.map((item) => {
        const presetItem = presetData.annualExpenses.find((p) => p.id === item.id)
        return presetItem
          ? { ...item, amount: presetItem.amount, enabled: presetItem.enabled }
          : item
      })
    )

    // Apply investment percentage
    const taxCalc = calculateNetTakeHome(jackpot, state, payoutType)
    setInvestmentAmount(Math.floor(taxCalc.netTakeHome * presetData.investmentPercent))
  }

  // Load saved data on mount
  useEffect(() => {
    const saved = loadWizardData()
    if (saved.currentStep) setCurrentStep(saved.currentStep)
    if (saved.visitedSteps) setVisitedSteps(saved.visitedSteps)
    if (saved.jackpot) setJackpot(saved.jackpot)
    if (saved.state) setState(saved.state)
    if (saved.payoutType) setPayoutType(saved.payoutType)
    if (saved.filingStatus) setFilingStatus(saved.filingStatus)
    if (saved.selectedPreset) setSelectedPreset(saved.selectedPreset)
    if (saved.debts) setDebts(saved.debts)
    if (saved.domiciles) setDomiciles(saved.domiciles)
    if (saved.travelToys) setTravelToys(saved.travelToys)
    if (saved.shareWealth) setShareWealth(saved.shareWealth)
    if (saved.annualExpenses) setAnnualExpenses(saved.annualExpenses)
    if (saved.investmentAmount) setInvestmentAmount(saved.investmentAmount)
    if (saved.annualReturn) setAnnualReturn(saved.annualReturn)
    setIsLoaded(true)
  }, [])

  const taxCalc = calculateNetTakeHome(jackpot, state, payoutType)
  const debtsCleared = debts.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)

  // Calculate all lifestyle dreams (domiciles + travel/toys + sharing)
  const domicilesTotal = domiciles.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const travelToysTotal = travelToys.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const shareWealthTotal = shareWealth.filter((d) => d.enabled).reduce((sum, d) => sum + d.amount, 0)
  const lifestyleDreams = domicilesTotal + travelToysTotal + shareWealthTotal

  const totalAnnualExpenses = annualExpenses.filter((e) => e.enabled).reduce((sum, exp) => sum + exp.amount, 0)

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
      selectedPreset,
      debts,
      domiciles,
      travelToys,
      shareWealth,
      annualExpenses,
      investmentAmount,
      annualReturn,
    })
  }, [
    currentStep,
    visitedSteps,
    jackpot,
    state,
    payoutType,
    filingStatus,
    selectedPreset,
    debts,
    domiciles,
    travelToys,
    shareWealth,
    annualExpenses,
    investmentAmount,
    annualReturn,
    isLoaded,
  ])

  // Track analytics
  useEffect(() => {
    if (!isLoaded) return

    const timer = setTimeout(() => {
      trackAnalytics()
    }, 1000)

    return () => clearTimeout(timer)
  }, [jackpot, state, debts, domiciles, travelToys, shareWealth, annualExpenses, investmentAmount, isLoaded])

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
          lifestyle: [
            ...domiciles.filter((d) => d.enabled).map((d) => ({ id: d.id, amount: d.amount })),
            ...travelToys.filter((d) => d.enabled).map((d) => ({ id: d.id, amount: d.amount })),
            ...shareWealth.filter((d) => d.enabled).map((d) => ({ id: d.id, amount: d.amount })),
          ],
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
            lifestyleItems: [
              ...domiciles.filter((d) => d.enabled),
              ...travelToys.filter((d) => d.enabled),
              ...shareWealth.filter((d) => d.enabled),
            ],
            annualExpenses: annualExpenses.filter((e) => e.enabled),
            investmentAmount,
            annualReturn,
            debtsCleared,
            lifestyleDreams,
            projections,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      // EmailGate will show success screen with print button - no auto-print
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
    if (currentStep < 8) {
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
    setJackpot(1500000000)
    setState('Washington')
    setPayoutType('lump-sum')
    setFilingStatus('single')
    setSelectedPreset('custom')
    setDebts(DEFAULT_DEBTS)
    setDomiciles(DEFAULT_DOMICILES)
    setTravelToys(DEFAULT_TRAVEL_TOYS)
    setShareWealth(DEFAULT_SHARE_WEALTH)
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

  // Navigation labels for each step
  const getNextLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Next: Clear Your Debts'
      case 2:
        return 'Next: Dream Homes'
      case 3:
        return 'Next: Luxury & Travel'
      case 4:
        return 'Next: Share the Wealth'
      case 5:
        return 'Next: Your New Normal'
      case 6:
        return 'Next: Plan Your Future'
      case 7:
        return 'See My Results'
      default:
        return 'Get My Report'
    }
  }

  return (
    <main className="min-h-screen py-4 md:py-8" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-7xl">
        <StartOverButton onStartOver={handleStartOver} />

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={8}
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
            <div className="animate-fadeIn space-y-6">
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
                  lumpSum={taxCalc.lumpSum}
                  federalTax={taxCalc.federalTax}
                  stateTax={taxCalc.stateTax}
                />
              </div>

              <PresetSelector selectedPreset={selectedPreset} onPresetChange={applyPreset} />

              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
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
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 3: Domiciles */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Domiciles</h2>
              </div>
              <SpendingSection
                title="Domiciles"
                subtitle="Where will you call home? Dream big!"
                items={domiciles}
                onItemsChange={setDomiciles}
                totalLabel="Total Real Estate"
                emptyMessage="No homes? Living that nomad life!"
              />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 4: Luxury & Travel */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Luxury & Travel</h2>
              </div>
              <SpendingSection
                title="Luxury & Travel"
                subtitle="What adventures await? What luxury items have you always wanted?"
                items={travelToys}
                onItemsChange={setTravelToys}
                totalLabel="Total Luxury Fund"
                emptyMessage="Saving it all for later?"
              />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 5: Share the Wealth */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Share the Wealth</h2>
              </div>
              <SpendingSection
                title="Share the Wealth"
                subtitle="Who would you take care of? What causes matter to you?"
                items={shareWealth}
                onItemsChange={setShareWealth}
                totalLabel="Total Generosity"
                emptyMessage="All for yourself? No judgment!"
              />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 6: Your New Normal */}
          {currentStep === 6 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">Your New Normal</h2>
              </div>
              <AnnualExpenses expenses={annualExpenses} onExpensesChange={setAnnualExpenses} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 7: The Future */}
          {currentStep === 7 && (
            <div className="animate-fadeIn">
              <div className="md:hidden mb-4 text-center">
                <h2 className="text-3xl font-bold text-primary-purple">The Future</h2>
              </div>
              <InvestmentSection
                defaultAmount={investmentAmount}
                remainingMoney={taxCalc.netTakeHome - debtsCleared - lifestyleDreams - investmentAmount}
                annualExpenses={totalAnnualExpenses}
                onInvestmentChange={(amount, returnRate) => {
                  setInvestmentAmount(amount)
                  setAnnualReturn(returnRate)
                }}
              />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 8: Your Results */}
          {currentStep === 8 && (
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

              <RealityCheck onGetReport={() => setShowEmailGate(true)} />

              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={() => setShowEmailGate(true)}
                nextLabel="Get My Report"
              />
            </div>
          )}
        </div>

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
