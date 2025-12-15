'use client'

interface StartOverButtonProps {
  onStartOver: () => void
}

export default function StartOverButton({ onStartOver }: StartOverButtonProps) {
  const handleClick = () => {
    if (confirm('Are you sure? This will clear all your data and start fresh.')) {
      onStartOver()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-white border-2 border-primary-purple text-primary-purple font-semibold rounded-lg hover:bg-primary-purple hover:text-white transition-all shadow-lg text-sm"
    >
      Start Over
    </button>
  )
}
