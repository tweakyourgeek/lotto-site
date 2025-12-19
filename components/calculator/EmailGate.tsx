'use client'

import { useState } from 'react'

interface EmailGateProps {
  onSubmit: (email: string) => void
  onPrint: () => void
  isOpen: boolean
  onClose: () => void
}

export default function EmailGate({ onSubmit, onPrint, isOpen, onClose }: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(email)
      setIsComplete(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsComplete(false)
    setEmail('')
    onClose()
  }

  // Success state - show print button
  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 md:p-12 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-navy/40 hover:text-navy text-2xl w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>

          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-primary-purple mb-3">
              You're All Set!
            </h2>
            <p className="text-lg text-navy mb-6">
              Your report is ready. Use the button below to print or save as PDF.
            </p>

            <div className="space-y-4">
              <button
                onClick={onPrint}
                className="w-full bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save as PDF
              </button>

              <a
                href="https://docs.google.com/spreadsheets/d/1qvNDRAk_8t0Vm0HC7_AfxYS3kaiIJD8AW4iIIKhKk8E/copy?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border-2 border-primary-purple text-primary-purple font-semibold py-4 px-6 rounded-lg hover:bg-light-blush transition-all text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Dream Life Income Calculator
              </a>

              <button
                onClick={handleClose}
                className="w-full text-navy/60 font-medium py-3 hover:text-navy transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-navy/50 mt-6">
              Tip: In the print dialog, select "Save as PDF" as your printer to download a PDF file.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 md:p-12 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-navy/40 hover:text-navy text-2xl w-8 h-8 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-3">
            Get Your Personalized Report
          </h2>
          <p className="text-lg text-navy">
            While you're waiting on your windfall, let's help you reach your Dream Life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-dusty-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-light-lavender text-lg"
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary-purple to-light-lavender text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'Sending...' : 'Get My Report'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-light-blush">
          <h3 className="font-semibold text-navy mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-navy/80">
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">✓</span>
              <span>Your complete lottery breakdown (print or save as PDF)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">✓</span>
              <a href="https://docs.google.com/spreadsheets/d/1qvNDRAk_8t0Vm0HC7_AfxYS3kaiIJD8AW4iIIKhKk8E/copy?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-primary-purple hover:underline">Dream Life Income Calculator</a> to plan your actual goals
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
