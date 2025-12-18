'use client'

import { useState } from 'react'

interface EmailGateProps {
  onSubmit: (email: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function EmailGate({ onSubmit, isOpen, onClose }: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 md:p-12 relative">
        <button
          onClick={onClose}
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
            {isSubmitting ? 'Sending...' : 'Send Me My Report'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-light-blush">
          <h3 className="font-semibold text-navy mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-navy/80">
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">✓</span>
              <span>Your complete lottery breakdown (save as PDF from print dialog)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">✓</span>
              <span>Dream Life Calculator to plan your actual goals</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
