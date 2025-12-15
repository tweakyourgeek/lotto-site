import { NextRequest, NextResponse } from 'next/server'
import { captureEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, data } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Get session ID from cookie
    const sessionId = request.cookies.get('session_id')?.value

    // Track email capture (only if database is configured)
    if (process.env.DATABASE_URL && sessionId) {
      await captureEmail(sessionId, email)
    }

    // TODO: Send email via SendGrid/Mailchimp
    // For now, we'll just log it and return success
    // You'll integrate your email provider here

    /*
    Example SendGrid integration:

    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: 'hello@tweakyourgeek.com',
      subject: 'Your Lottery Reality Check Report',
      text: 'Here is your personalized lottery reality check report...',
      html: generateEmailHTML(data),
    }

    await sgMail.send(msg)
    */

    console.log('Email capture:', email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 })
  }
}
