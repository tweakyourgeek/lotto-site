import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your Billion Dollar Blueprint | Tweak Your Geek',
  description: 'What would YOU do with a billion dollars? Plan your dream life with this interactive lottery calculator.',
  keywords: 'lottery calculator, financial planning, dream life planner, lottery taxes, net winnings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
