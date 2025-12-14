import { NextResponse } from 'next/server'
import { getStateDistribution } from '@/lib/db'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    const data = await getStateDistribution()
    return NextResponse.json(data)
  } catch (error) {
    console.error('States API error:', error)
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 })
  }
}
