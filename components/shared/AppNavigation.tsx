'use client'

interface AppNavigationProps {
  currentApp: 'lottery' | 'dream-life'
}

export default function AppNavigation({ currentApp }: AppNavigationProps) {
  return (
    <div className="mb-4 flex justify-center">
      <div className="inline-flex bg-white rounded-lg shadow-md p-1 gap-1">
        <a
          href="/"
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            currentApp === 'lottery'
              ? 'bg-gradient-to-r from-primary-purple to-light-lavender text-white'
              : 'text-navy hover:bg-light-blush'
          }`}
        >
          🎰 Lottery
        </a>
        <a
          href="/dream-life"
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            currentApp === 'dream-life'
              ? 'bg-gradient-to-r from-primary-purple to-light-lavender text-white'
              : 'text-navy hover:bg-light-blush'
          }`}
        >
          ✨ Dream Life
        </a>
      </div>
    </div>
  )
}
