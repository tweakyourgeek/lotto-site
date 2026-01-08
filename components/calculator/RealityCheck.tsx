'use client'

interface RealityCheckProps {
  onGetReport?: () => void
}

export default function RealityCheck({ onGetReport }: RealityCheckProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-6 text-center">
        Dream Big, Plan Smart
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-purple/10 to-light-lavender/20 rounded-xl p-6 text-center">
          <p className="text-xl text-navy font-semibold mb-3">
            Your dream life is closer than you think
          </p>
          <p className="text-navy/80 mb-4">
            Skip the lottery and calculate what your dream life actually costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/dream-life"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary-purple to-light-lavender text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Calculate My Dream Life
            </a>
            <button
              onClick={onGetReport}
              className="inline-block px-6 py-3 border-2 border-primary-purple text-primary-purple rounded-lg hover:bg-light-blush transition-colors font-semibold"
            >
              Get Lottery Report
            </button>
          </div>
        </div>

        {/* Movie References */}
        <div className="bg-light-blush rounded-xl p-6">
          <h3 className="font-semibold text-navy mb-4 text-lg text-center">
            Inspired By True Stories & Great Films
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://amzn.to/3YyRk7p"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🎰</span>
              <div>
                <p className="font-semibold text-navy">Jerry & Marge Go Large</p>
                <p className="text-sm text-navy/60">A true story of beating the system</p>
              </div>
            </a>
            <a
              href="https://amzn.to/4p2dD0c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-semibold text-navy">Brewster's Millions</p>
                <p className="text-sm text-navy/60">The original "spend it all" challenge</p>
              </div>
            </a>
          </div>
        </div>

        {/* Disclaimer - simplified */}
        <div className="text-center pt-4">
          <p className="text-xs text-navy/50">
            Tax calculations are estimates based on current federal rates and state averages.
            Investment projections assume compound annual growth. This is for entertainment
            and planning purposes only - always consult professionals for financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
