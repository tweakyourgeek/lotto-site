import { NextResponse } from 'next/server'
import { getPopularDebts } from '@/lib/db'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    const data = await getPopularDebts()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Debts API error:', error)
    return NextResponse.json({ error: 'Failed to fetch debts' }, { status: 500 })
  }
}
