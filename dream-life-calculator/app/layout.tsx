import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dream Life Calculator | Tweak Your Geek',
  description: 'What does YOUR real dream life cost? Find out the income you need — broken down to the hour.',
  keywords: 'dream life calculator, income needed, cost of living, financial planning, budget planner',
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
