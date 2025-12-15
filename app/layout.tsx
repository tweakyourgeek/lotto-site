import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Billion Dollar Blueprint | Tweak Your Geek',
  description: 'What would YOU do if you won the LOTTO? Plan your dream life with this interactive lottery calculator.',
  keywords: 'lottery calculator, financial planning, dream life planner, lottery taxes, net winnings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
