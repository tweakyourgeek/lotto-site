import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createOrUpdateSession } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Get or create session ID from cookie
    let sessionId = request.cookies.get('session_id')?.value
    if (!sessionId) {
      sessionId = uuidv4()
    }

    // Track analytics (only if database is configured)
    if (process.env.DATABASE_URL) {
      await createOrUpdateSession(sessionId, {
        jackpot: data.jackpot,
        state: data.state,
        payoutType: data.payoutType,
        debtsCleared: data.debtsCleared,
        lifestyleDreams: data.lifestyleDreams,
        investmentAmount: data.investmentAmount,
        debts: data.debts || [],
        lifestyle: data.lifestyle || [],
      })
    }

    const response = NextResponse.json({ success: true, sessionId })

    // Set session cookie
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error) {
    console.error('Analytics error:', error)
    // Don't fail - just return success without tracking
    return NextResponse.json({ success: true })
  }
}
