import { NextResponse } from 'next/server'
import { getPopularLifestyle } from '@/lib/db'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    const data = await getPopularLifestyle()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Lifestyle API error:', error)
    return NextResponse.json({ error: 'Failed to fetch lifestyle' }, { status: 500 })
  }
}
