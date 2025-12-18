import { NextRequest, NextResponse } from 'next/server'
import { captureEmail } from '@/lib/db'

interface MailerliteSubscriber {
  email: string
  fields?: Record<string, string | number>
  groups?: string[]
}

async function addToMailerlite(subscriber: MailerliteSubscriber): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY

  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: subscriber.email,
        fields: subscriber.fields,
        groups: subscriber.groups,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Mailerlite error:', error)
      return false
    }

    console.log('Subscriber added to Mailerlite:', subscriber.email)
    return true
  } catch (error) {
    console.error('Mailerlite API error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, data } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Get session ID from cookie
    const sessionId = request.cookies.get('session_id')?.value

    // Track email capture in database (if configured)
    if (process.env.DATABASE_URL && sessionId) {
      await captureEmail(sessionId, email)
    }

    // Add subscriber to Mailerlite
    const groupId = process.env.MAILERLITE_GROUP_ID

    await addToMailerlite({
      email,
      fields: {
        // Custom fields you can set up in Mailerlite
        lottery_jackpot: data?.jackpot || 0,
        lottery_net: data?.netTakeHome || 0,
        lottery_state: data?.state || '',
      },
      groups: groupId ? [groupId] : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 })
  }
}
