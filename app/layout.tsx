import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Lottery Reality Check | Tweak Your Geek',
  description: 'What would YOU do with a billion dollars? Find out what you really value when money isn\'t the constraint.',
  keywords: 'lottery calculator, financial planning, lottery taxes, net winnings',
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
