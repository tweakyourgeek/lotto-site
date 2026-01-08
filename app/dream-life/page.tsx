'use client'

import { useState, useEffect, useRef } from 'react'
import ExpenseSection from '@/components/dream-life/ExpenseSection'
import ProgressIndicator from '@/components/wizard/ProgressIndicator'
import WizardNavigation from '@/components/wizard/WizardNavigation'
import StartOverButton from '@/components/wizard/StartOverButton'
import AppNavigation from '@/components/shared/AppNavigation'
import {
  DEFAULT_HOME_EXPENSES,
  DEFAULT_DAILY_RHYTHM,
  DEFAULT_SUPPORT_SQUAD,
  DEFAULT_SELF_CARE,
  DEFAULT_ADVENTURES,
  DEFAULT_TIME_FREEDOM,
  DreamExpense,
} from '@/lib/constants'
import {
  calculateTotalAnnualExpenses,
  calculateIncomeNeeded,
  calculatePathsToIncome,
  formatCurrency,
} from '@/lib/calculations'

const STEPS = [
  { number: 1, title: 'Start Here' },
  { number: 2, title: 'Your Home' },
  { number: 3, title: 'Daily Rhythm' },
  { number: 4, title: 'Support Squad' },
  { number: 5, title: 'Self-Care' },
  { number: 6, title: 'Adventures' },
  { number: 7, title: 'Time Freedom' },
  { number: 8, title: 'Your Dream Life' },
]

export default function DreamLifePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  const [currentIncome, setCurrentIncome] = useState<number>(0)

  const [homeExpenses, setHomeExpenses] = useState<DreamExpense[]>(DEFAULT_HOME_EXPENSES)
  const [dailyRhythm, setDailyRhythm] = useState<DreamExpense[]>(DEFAULT_DAILY_RHYTHM)
  const [supportSquad, setSupportSquad] = useState<DreamExpense[]>(DEFAULT_SUPPORT_SQUAD)
  const [selfCare, setSelfCare] = useState<DreamExpense[]>(DEFAULT_SELF_CARE)
  const [adventures, setAdventures] = useState<DreamExpense[]>(DEFAULT_ADVENTURES)
  const [timeFreedom, setTimeFreedom] = useState<DreamExpense[]>(DEFAULT_TIME_FREEDOM)

  const containerRef = useRef<HTMLDivElement>(null)

  const totalAnnualExpenses =
    calculateTotalAnnualExpenses(homeExpenses) +
    calculateTotalAnnualExpenses(dailyRhythm) +
    calculateTotalAnnualExpenses(supportSquad) +
    calculateTotalAnnualExpenses(selfCare) +
    calculateTotalAnnualExpenses(adventures) +
    calculateTotalAnnualExpenses(timeFreedom)

  const incomeNeeded = calculateIncomeNeeded(totalAnnualExpenses)
  const paths = calculatePathsToIncome(incomeNeeded.annualGross, currentIncome)

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
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setVisitedSteps([1])
    setCurrentIncome(0)
    setHomeExpenses(DEFAULT_HOME_EXPENSES)
    setDailyRhythm(DEFAULT_DAILY_RHYTHM)
    setSupportSquad(DEFAULT_SUPPORT_SQUAD)
    setSelfCare(DEFAULT_SELF_CARE)
    setAdventures(DEFAULT_ADVENTURES)
    setTimeFreedom(DEFAULT_TIME_FREEDOM)
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stepsWithVisited = STEPS.map((step) => ({
    ...step,
    visited: visitedSteps.includes(step.number),
  }))

  const getNextLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Next: Your Home'
      case 2:
        return 'Next: Daily Rhythm'
      case 3:
        return 'Next: Support Squad'
      case 4:
        return 'Next: Self-Care'
      case 5:
        return 'Next: Adventures'
      case 6:
        return 'Next: Time Freedom'
      case 7:
        return 'See My Dream Life'
      default:
        return 'Continue'
    }
  }

  return (
    <main className="min-h-screen py-4 md:py-8" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-7xl">
        <StartOverButton onStartOver={handleStartOver} />
        <AppNavigation currentApp="dream-life" />

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={8}
          steps={stepsWithVisited}
          onStepClick={goToStep}
        />

        {/* Running Total */}
        <div className="mb-6 text-center">
          <div className="bg-gradient-to-r from-primary-purple to-light-lavender rounded-2xl shadow-lg p-4 md:p-6">
            <p className="text-sm text-white/80 mb-1">Your Dream Life Costs</p>
            <p className="text-3xl md:text-5xl font-bold text-white">
              {formatCurrency(totalAnnualExpenses)}
              <span className="text-lg md:text-xl font-normal">/year</span>
            </p>
            <p className="text-sm text-white/80 mt-1">
              {formatCurrency(incomeNeeded.monthly)}/month • {formatCurrency(incomeNeeded.weekly)}
              /week
            </p>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {/* Step 1: Start Here */}
          {currentStep === 1 && (
            <div className="animate-fadeIn space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-bold text-primary-purple mb-4">
                    How Much Money Do You Need?
                  </h1>
                  <p className="text-xl md:text-2xl text-navy mb-6">
                    Let's design your dream life, then calculate what it actually costs.
                  </p>
                  <div className="bg-light-blush/40 rounded-xl p-6 mb-8">
                    <p className="text-lg text-navy/80">
                      You might be surprised. Your dream life is probably{' '}
                      <span className="font-bold text-primary-purple">
                        closer than you think
                      </span>
                      .
                    </p>
                  </div>

                  <div className="text-left bg-gradient-to-br from-primary-purple/10 to-light-lavender/20 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-navy mb-3">
                      What's your current annual income? (Optional)
                    </label>
                    <p className="text-xs text-navy/60 mb-3">
                      This helps us show you the gap between where you are and where you want to
                      be.
                    </p>
                    <div className="relative max-w-md">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-primary-purple font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        value={currentIncome || ''}
                        onChange={(e) => setCurrentIncome(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-primary-purple border-2 border-dusty-rose rounded-xl focus:outline-none focus:ring-2 focus:ring-light-lavender"
                      />
                    </div>
                    <p className="text-xs text-navy/60 mt-2">Skip this if you prefer</p>
                  </div>
                </div>
              </div>

              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={getNextLabel()}
              />
            </div>
          )}

          {/* Step 2: Your Home */}
          {currentStep === 2 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Home Sweet Home"
                subtitle="Where do you live? What does it feel like?"
                emoji="🏡"
                expenses={homeExpenses}
                onExpensesChange={setHomeExpenses}
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

          {/* Step 3: Daily Rhythm */}
          {currentStep === 3 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Daily Rhythm"
                subtitle="What does a typical Tuesday look like in your dream life?"
                emoji="☕"
                expenses={dailyRhythm}
                onExpensesChange={setDailyRhythm}
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

          {/* Step 4: Support Squad */}
          {currentStep === 4 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Support Squad"
                subtitle="Who makes your life easier? What help do you have?"
                emoji="🤝"
                expenses={supportSquad}
                onExpensesChange={setSupportSquad}
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

          {/* Step 5: Self-Care */}
          {currentStep === 5 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Self-Care"
                subtitle="How do you take care of yourself, physically and mentally?"
                emoji="🧘"
                expenses={selfCare}
                onExpensesChange={setSelfCare}
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

          {/* Step 6: Adventures */}
          {currentStep === 6 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Adventures"
                subtitle="What experiences make life worth living?"
                emoji="✈️"
                expenses={adventures}
                onExpensesChange={setAdventures}
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

          {/* Step 7: Time Freedom */}
          {currentStep === 7 && (
            <div className="animate-fadeIn space-y-6">
              <ExpenseSection
                title="Your Time Freedom"
                subtitle="What gives you peace of mind and flexibility?"
                emoji="🕊️"
                expenses={timeFreedom}
                onExpensesChange={setTimeFreedom}
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

          {/* Step 8: Results */}
          {currentStep === 8 && (
            <div className="animate-fadeIn space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-primary-purple to-navy rounded-2xl shadow-lg p-8 md:p-12 text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Dream Life Actually Costs
                  </h2>
                  <div className="text-5xl md:text-7xl font-bold mb-2">
                    {formatCurrency(totalAnnualExpenses)}
                  </div>
                  <p className="text-xl opacity-90">per year</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-sm opacity-80 mb-1">Monthly</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {formatCurrency(incomeNeeded.monthly)}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-sm opacity-80 mb-1">Weekly</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {formatCurrency(incomeNeeded.weekly)}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-sm opacity-80 mb-1">Daily</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {formatCurrency(incomeNeeded.daily)}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-sm opacity-80 mb-1">Hourly</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {formatCurrency(incomeNeeded.hourly)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Income Needed */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-4">
                  Income You Need
                </h2>
                <div className="bg-light-blush/30 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-navy/70">After-tax income needed:</span>
                    <span className="text-2xl font-bold text-primary-purple">
                      {formatCurrency(incomeNeeded.annualNet)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-navy/70">Before-tax income needed (est. 30% tax):</span>
                    <span className="text-2xl font-bold text-navy">
                      {formatCurrency(incomeNeeded.annualGross)}
                    </span>
                  </div>
                </div>

                {currentIncome > 0 && (
                  <div className="bg-gradient-to-r from-primary-purple/10 to-light-lavender/20 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-navy mb-2">Your Gap</h3>
                    {currentIncome >= incomeNeeded.annualGross ? (
                      <p className="text-lg text-navy">
                        🎉{' '}
                        <span className="font-bold text-primary-purple">
                          You're already there!
                        </span>{' '}
                        Your current income covers your dream life.
                      </p>
                    ) : (
                      <div>
                        <p className="text-lg text-navy mb-2">
                          You're{' '}
                          <span className="font-bold text-primary-purple">
                            {formatCurrency(incomeNeeded.annualGross - currentIncome)}
                          </span>{' '}
                          away from your dream life.
                        </p>
                        <div className="bg-white rounded-lg p-3">
                          <div className="bg-light-blush rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary-purple to-light-lavender h-full transition-all"
                              style={{
                                width: `${Math.min(100, (currentIncome / incomeNeeded.annualGross) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-sm text-navy/60 mt-2 text-center">
                            You're{' '}
                            {Math.round((currentIncome / incomeNeeded.annualGross) * 100)}% of the
                            way there
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Paths to Income */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-4">
                  How to Get There
                </h2>
                <p className="text-navy/70 mb-6">Here are your paths to your dream life:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paths.map((path) => (
                    <div
                      key={path.type}
                      className="border-2 border-dusty-rose rounded-xl p-5 hover:border-primary-purple transition-colors"
                    >
                      <h3 className="font-bold text-navy mb-2">{path.title}</h3>
                      <p className="text-2xl font-bold text-primary-purple mb-2">{path.amount}</p>
                      <p className="text-sm text-navy/70 mb-2">{path.description}</p>
                      {path.timeframe && (
                        <p className="text-xs text-navy/50 italic">{path.timeframe}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bridge to Lottery */}
              <div className="bg-gradient-to-r from-primary-purple/10 to-light-lavender/20 rounded-2xl p-8 text-center">
                <p className="text-lg text-navy mb-4">
                  Want to see what happens if you{' '}
                  <span className="font-bold">won the lottery</span>?
                </p>
                <a
                  href="/"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
                >
                  Try the Lottery Calculator
                </a>
              </div>

              <WizardNavigation
                currentStep={currentStep}
                totalSteps={8}
                onBack={handleBack}
                onNext={() => {}}
                nextLabel=""
                hideNext
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
          <p className="text-xs text-navy/40">
            Tax estimates are simplified. Consult a financial professional for personalized advice.
          </p>
        </footer>
      </div>
    </main>
  )
}
