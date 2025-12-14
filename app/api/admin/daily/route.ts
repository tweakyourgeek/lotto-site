import { NextResponse } from 'next/server'
import { getDailyStats } from '@/lib/db'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    const data = await getDailyStats(30)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Daily stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch daily stats' }, { status: 500 })
  }
}
