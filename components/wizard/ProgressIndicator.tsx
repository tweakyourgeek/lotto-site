'use client'

interface Step {
  number: number
  title: string
  visited: boolean
}

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Step[]
  onStepClick: (step: number) => void
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy/70 font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-primary-purple font-bold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-light-blush rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-purple to-light-lavender transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <button
              onClick={() => step.visited && onStepClick(step.number)}
              disabled={!step.visited}
              className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs
                transition-all duration-300
                ${
                  step.number === currentStep
                    ? 'bg-primary-purple text-white scale-110 shadow-lg'
                    : step.visited
                    ? 'bg-light-lavender text-white hover:scale-105 cursor-pointer'
                    : 'bg-light-blush text-navy/40 cursor-not-allowed'
                }
              `}
              aria-label={`${step.visited ? 'Go to' : ''} Step ${step.number}: ${step.title}`}
              aria-current={step.number === currentStep ? 'step' : undefined}
            >
              {step.number}
            </button>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-1 bg-light-blush rounded">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    step.number < currentStep ? 'bg-light-lavender' : 'bg-transparent'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Titles - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between mt-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex-1 text-center text-xs font-medium transition-colors ${
              step.number === currentStep
                ? 'text-primary-purple font-bold'
                : step.visited
                ? 'text-navy/60'
                : 'text-navy/30'
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>

      {/* Current Step Title - Mobile */}
      <div className="md:hidden text-center mt-3">
        <h2 className="text-2xl font-bold text-primary-purple">
          {steps.find((s) => s.number === currentStep)?.title}
        </h2>
      </div>
    </div>
  )
}
