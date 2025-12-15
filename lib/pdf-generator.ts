import { formatCurrency } from './calculations'

interface PDFData {
  jackpot: number
  netTakeHome: number
  state: string
  debts: Array<{ label: string; amount: number }>
  lifestyleItems: Array<{ label: string; amount: number; why: string }>
  investmentAmount: number
  annualReturn: number
  debtsCleared: number
  lifestyleDreams: number
}

export function generatePDFHTML(data: PDFData): string {
  const {
    jackpot,
    netTakeHome,
    state,
    debts,
    lifestyleItems,
    investmentAmount,
    annualReturn,
    debtsCleared,
    lifestyleDreams,
  } = data

  const value10Years = investmentAmount * Math.pow(1 + annualReturn / 100, 10)
  const value30Years = investmentAmount * Math.pow(1 + annualReturn / 100, 30)

  const annual = lifestyleDreams
  const monthly = annual / 12
  const weekly = annual / 52
  const daily = annual / 365

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      color: #3B3B58;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #7A5980;
    }
    h1 {
      color: #7A5980;
      font-size: 36px;
      margin: 0 0 10px 0;
    }
    h2 {
      color: #7A5980;
      font-size: 24px;
      margin: 30px 0 15px 0;
    }
    .hero-number {
      font-size: 48px;
      font-weight: bold;
      color: #7A5980;
      margin: 20px 0;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background: #ECD7D5;
      border-radius: 10px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #C68A98;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-label {
      font-weight: 600;
    }
    .item-why {
      font-style: italic;
      color: #7A5980;
      font-size: 14px;
      margin-top: 5px;
    }
    .total {
      font-size: 28px;
      font-weight: bold;
      color: #7A5980;
      text-align: center;
      margin: 20px 0;
    }
    .breakdown {
      background: #7A5980;
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin: 30px 0;
    }
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 18px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #BC7C9C;
      text-align: center;
      font-size: 12px;
      color: #3B3B58;
    }
    .quote {
      font-style: italic;
      color: #BC7C9C;
      text-align: center;
      font-size: 18px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Your Lottery Reality Check</h1>
    <p style="font-size: 18px; color: #BC7C9C;">What you'd do with ${formatCurrency(jackpot)}</p>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <p style="font-size: 14px; margin: 0;">Your Net Take-Home (${state})</p>
    <div class="hero-number">${formatCurrency(netTakeHome)}</div>
  </div>

  <div class="section">
    <h2>Debts You'd Clear</h2>
    ${debts.map(debt => `
      <div class="item">
        <span class="item-label">${debt.label}</span>
        <span>${formatCurrency(debt.amount)}</span>
      </div>
    `).join('')}
    <div class="total">${formatCurrency(debtsCleared)}</div>
    <p class="quote">How does it feel to clear that?</p>
  </div>

  <div class="section">
    <h2>Your Dreams & Lifestyle</h2>
    ${lifestyleItems.map(item => `
      <div class="item">
        <div style="flex: 1;">
          <div class="item-label">${item.label}</div>
          <div class="item-why">${item.why}</div>
        </div>
        <span style="font-weight: 600;">${formatCurrency(item.amount)}</span>
      </div>
    `).join('')}
    <div class="total">${formatCurrency(lifestyleDreams)}</div>
    <p class="quote">Notice what showed up on your list?</p>
  </div>

  <div class="section">
    <h2>Your Investment Future</h2>
    <div class="item">
      <span class="item-label">Amount Invested</span>
      <span>${formatCurrency(investmentAmount)}</span>
    </div>
    <div class="item">
      <span class="item-label">Annual Return</span>
      <span>${annualReturn}%</span>
    </div>
    <div class="item">
      <span class="item-label">Value in 10 Years</span>
      <span>${formatCurrency(value10Years)}</span>
    </div>
    <div class="item">
      <span class="item-label">Value in 30 Years</span>
      <span>${formatCurrency(value30Years)}</span>
    </div>
    <p class="quote">Time does the heavy lifting. You just have to let it.</p>
  </div>

  <div class="breakdown">
    <h2 style="color: white; text-align: center; margin-top: 0;">Your Dream Life Actually Costs</h2>
    <div class="breakdown-item">
      <span>Annual</span>
      <span>${formatCurrency(annual)}</span>
    </div>
    <div class="breakdown-item">
      <span>Monthly</span>
      <span>${formatCurrency(monthly)}</span>
    </div>
    <div class="breakdown-item">
      <span>Weekly</span>
      <span>${formatCurrency(weekly)}</span>
    </div>
    <div class="breakdown-item">
      <span>Daily</span>
      <span>${formatCurrency(daily)}</span>
    </div>
    <p style="text-align: center; font-size: 20px; margin-top: 30px;">
      Good news: You probably don't need a billion dollars.<br>
      <strong>You need a plan.</strong>
    </p>
  </div>

  <div style="background: #ECD7D5; padding: 20px; border-radius: 10px; margin: 30px 0;">
    <h3 style="color: #7A5980; margin-top: 0;">Next Steps</h3>
    <p>Ready to build your actual dream life? Here's what you have access to:</p>
    <ul style="color: #3B3B58;">
      <li><strong>Dream Life Calculator:</strong> Plan your real financial goals</li>
      <li><strong>No Spend Journal:</strong> Track your progress and build awareness</li>
      <li><strong>Community Access:</strong> Connect with others on the same journey</li>
    </ul>
    <p style="text-align: center; margin-top: 20px;">
      <a href="https://tweakyourgeek.com" style="color: #7A5980; font-weight: 600;">Visit Tweak Your Geek →</a>
    </p>
  </div>

  <div class="footer">
    <p><strong>Reality Check:</strong> This calculator shows what you value when money isn't the constraint.
    It's a mirror for your priorities, not financial advice.</p>
    <p>Tax calculations based on current federal rates and state averages. Investment projections assume compound annual growth.
    Always consult with financial and tax professionals for personalized advice.</p>
    <p style="margin-top: 20px;">Data based on <a href="https://www.usamega.com/powerball/jackpot" style="color: #7A5980;">usamega.com</a> (established 1999)</p>
    <p style="margin-top: 20px;">Created by <a href="https://tweakyourgeek.com" style="color: #7A5980;">Tweak Your Geek</a></p>
  </div>
</body>
</html>
`
}
