import { NextRequest, NextResponse } from 'next/server'
import { captureEmail } from '@/lib/db'

interface MailerliteSubscriber {
  email: string
  fields?: Record<string, string | number>
  groups?: string[]
}

async function addToMailerlite(subscriber: MailerliteSubscriber): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY

  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY not configured - skipping Mailerlite')
    return { success: false, error: 'API key not configured' }
  }

  try {
    // Build the request body - only include fields that are set up in Mailerlite
    const body: any = {
      email: subscriber.email,
    }

    // Only add groups if provided
    if (subscriber.groups && subscriber.groups.length > 0) {
      body.groups = subscriber.groups
    }

    // Only add custom fields if they exist
    // Note: These fields must be created in Mailerlite dashboard first!
    if (subscriber.fields) {
      body.fields = subscriber.fields
    }

    console.log('Sending to Mailerlite:', JSON.stringify(body, null, 2))

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Mailerlite API error:', response.status, JSON.stringify(responseData, null, 2))
      return { success: false, error: responseData.message || 'API error' }
    }

    console.log('Successfully added to Mailerlite:', subscriber.email)
    return { success: true }
  } catch (error) {
    console.error('Mailerlite network error:', error)
    return { success: false, error: String(error) }
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

    const result = await addToMailerlite({
      email,
      // Note: Remove custom fields if you haven't set them up in Mailerlite
      // fields: {
      //   lottery_jackpot: data?.jackpot || 0,
      //   lottery_net: data?.netTakeHome || 0,
      //   lottery_state: data?.state || '',
      // },
      groups: groupId ? [groupId] : undefined,
    })

    if (!result.success) {
      console.warn('Mailerlite add failed:', result.error, '- but continuing anyway')
    }

    return NextResponse.json({
      success: true,
      mailerlite: result.success,
      mailerliteError: result.error,
    })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 })
  }
}
