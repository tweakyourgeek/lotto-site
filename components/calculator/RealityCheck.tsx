'use client'

export default function RealityCheck() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-6 text-center">
        Reality Check
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-light-blush rounded-xl p-6">
          <h3 className="font-semibold text-navy mb-2 text-lg">What this does:</h3>
          <p className="text-navy/80">
            Shows what YOU value when money isn't the constraint. It's a mirror for your priorities, not a financial plan.
          </p>
        </div>

        <div className="bg-light-blush rounded-xl p-6">
          <h3 className="font-semibold text-navy mb-2 text-lg">What it doesn't:</h3>
          <ul className="space-y-2 text-navy/80">
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">•</span>
              <span>Replace professional tax advice (talk to a CPA)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">•</span>
              <span>Guarantee exact amounts (state laws and situations vary)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-purple mr-2">•</span>
              <span>Make you win the lottery (but we can dream!)</span>
            </li>
          </ul>
        </div>

        <div className="text-center pt-6">
          <p className="text-sm text-navy/60">
            Tax calculations based on current federal rates and state averages.
            <br />
            Investment projections assume compound annual growth with no withdrawals.
            <br />
            Always consult with financial and tax professionals for personalized advice.
          </p>
        </div>
      </div>
    </div>
  )
}
