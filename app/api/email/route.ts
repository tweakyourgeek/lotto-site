import { NextRequest, NextResponse } from 'next/server'
import { captureEmail } from '@/lib/db'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

function generateEmailHTML(data: {
  jackpot: number
  netTakeHome: number
  debtsCleared: number
  lifestyleDreams: number
}): string {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica', 'Arial', sans-serif; color: #3B3B58; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #7A5980;">
      <h1 style="color: #7A5980; font-size: 28px; margin: 0 0 10px 0;">Your Lottery Reality Check</h1>
      <p style="font-size: 16px; color: #BC7C9C; margin: 0;">Here's what you discovered about yourself</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 14px; margin: 0; color: #666;">Your Jackpot</p>
      <div style="font-size: 36px; font-weight: bold; color: #7A5980; margin: 10px 0;">${formatCurrency(data.jackpot)}</div>
      <p style="font-size: 14px; margin: 0; color: #666;">Net Take-Home</p>
      <div style="font-size: 24px; font-weight: bold; color: #3B3B58;">${formatCurrency(data.netTakeHome)}</div>
    </div>

    <div style="background: #ECD7D5; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #C68A98;">
            <strong>Debts You'd Clear</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #C68A98; text-align: right;">
            ${formatCurrency(data.debtsCleared)}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0;">
            <strong>Dream Lifestyle</strong>
          </td>
          <td style="padding: 10px 0; text-align: right;">
            ${formatCurrency(data.lifestyleDreams)}
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #7A5980; color: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center;">
      <p style="font-size: 18px; margin: 0 0 10px 0;">Good news:</p>
      <p style="font-size: 22px; font-weight: bold; margin: 0;">You probably don't need a billion dollars.</p>
      <p style="font-size: 18px; margin: 10px 0 0 0;">You need a plan.</p>
    </div>

    <div style="background: #ECD7D5; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="color: #7A5980; margin-top: 0;">Ready to build your actual dream life?</h3>
      <ul style="color: #3B3B58; padding-left: 20px;">
        <li style="margin-bottom: 10px;"><strong>Dream Life Calculator:</strong> Plan your real financial goals</li>
        <li style="margin-bottom: 10px;"><strong>No Spend Journal:</strong> Track your progress and build awareness</li>
        <li><strong>Community Access:</strong> Connect with others on the same journey</li>
      </ul>
      <p style="text-align: center; margin-top: 20px;">
        <a href="https://tweakyourgeek.com" style="display: inline-block; background: #7A5980; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: 600;">Visit Tweak Your Geek →</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #BC7C9C; text-align: center; font-size: 12px; color: #666;">
      <p><strong>Reality Check:</strong> This calculator shows what you value when money isn't the constraint. It's a mirror for your priorities, not financial advice.</p>
      <p style="margin-top: 15px;">
        <a href="https://tweakyourgeek.com" style="color: #7A5980;">Tweak Your Geek</a>
      </p>
    </div>
  </div>
</body>
</html>
`
}

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

    // Send email via SendGrid if configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your Lottery Reality Check Results',
        html: generateEmailHTML(data),
      }

      await sgMail.send(msg)
      console.log('Email sent successfully to:', email)
    } else {
      // Log warning if SendGrid not configured
      console.warn('SendGrid not configured. Email not sent. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL environment variables.')
      console.log('Email would have been sent to:', email)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
