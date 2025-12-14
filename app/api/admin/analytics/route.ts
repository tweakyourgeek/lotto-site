import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/db'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        total_sessions: 0,
        completed_sessions: 0,
        email_captures: 0,
        avg_jackpot: 0,
        avg_debts_cleared: 0,
        avg_lifestyle_dreams: 0,
        avg_investment_amount: 0,
      })
    }

    const data = await getAnalyticsSummary()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
