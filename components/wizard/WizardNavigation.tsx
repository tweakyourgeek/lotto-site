'use client'

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  isLastStep?: boolean
  hideNext?: boolean
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextLabel,
  isLastStep,
  hideNext,
}: WizardNavigationProps) {
  const defaultNextLabel = isLastStep ? 'See My Results →' : 'Next →'

  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t-2 border-light-blush">
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="px-6 py-3 text-primary-purple font-semibold rounded-lg border-2 border-primary-purple hover:bg-primary-purple hover:text-white transition-all"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {!hideNext && (
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold rounded-lg hover:shadow-lg transition-all ml-auto"
        >
          {nextLabel || defaultNextLabel}
        </button>
      )}
    </div>
  )
}
