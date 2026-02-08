/**
 * Dream Life Calculator - Page Scaffold
 *
 * This is a starting point for the standalone Dream Life Calculator app.
 * When extracted to its own repo, this becomes the main page.
 *
 * Flow:
 *   1. User enters recurring monthly expenses (realistic amounts)
 *   2. Optionally adds one-time purchases (amortized)
 *   3. Sees total annual cost + income breakdown (year/month/week/day/hour)
 *   4. Email gate → gets printable report
 *
 * Components adapted from the lottery calculator:
 *   - CostBreakdown ← DreamLifeCost (now shows income needed, not fantasy costs)
 *   - ExpenseInput  ← AnnualExpenses (realistic defaults, not windfall amounts)
 *   - EmailCapture  ← EmailGate (no lottery references, standalone CTA)
 *
 * Shared brand:
 *   - Same Tailwind color palette (primary-purple, dusty-rose, etc.)
 *   - Same font (Inter)
 *   - Same card/gradient styling
 *
 * TODO when extracting to own repo:
 *   - Copy tailwind.config.js, globals.css, postcss.config.js
 *   - Set up own package.json (Next.js, React, Tailwind — no Recharts/pg/Clerk needed initially)
 *   - Add API routes for email capture + PDF generation
 *   - Set up own Vercel project
 *   - Update NEXT_PUBLIC_DREAM_LIFE_CALCULATOR_URL in lotto-site env to point here
 */

// Example usage of the components:
//
// import { useState } from 'react'
// import CostBreakdown from '../components/CostBreakdown'
// import ExpenseInput from '../components/ExpenseInput'
// import EmailCapture from '../components/EmailCapture'
// import { DEFAULT_RECURRING_EXPENSES, DEFAULT_ONEOFF_EXPENSES } from '../lib/constants'
//
// export default function DreamLifeCalculator() {
//   const [recurringExpenses, setRecurringExpenses] = useState(DEFAULT_RECURRING_EXPENSES)
//   const [oneOffExpenses, setOneOffExpenses] = useState(DEFAULT_ONEOFF_EXPENSES)
//   const [showEmailCapture, setShowEmailCapture] = useState(false)
//
//   const totalRecurring = recurringExpenses
//     .filter(e => e.enabled)
//     .reduce((sum, e) => sum + e.amount, 0)
//
//   const totalOneOff = oneOffExpenses
//     .filter(e => e.enabled)
//     .reduce((sum, e) => sum + e.amount, 0)
//
//   // Amortize one-time purchases over 5 years
//   const amortizedOneOff = totalOneOff / 5
//   const totalAnnual = totalRecurring + amortizedOneOff
//
//   return (
//     <main className="min-h-screen py-4 md:py-8">
//       <div className="container mx-auto px-4 max-w-7xl space-y-6">
//         <h1>What Does Your Dream Life Actually Cost?</h1>
//
//         <ExpenseInput
//           title="Your Monthly Reality"
//           subtitle="What does your dream life cost each month?"
//           expenses={recurringExpenses}
//           onExpensesChange={setRecurringExpenses}
//         />
//
//         <ExpenseInput
//           title="Big Purchases"
//           subtitle="Any one-time expenses in the next few years?"
//           expenses={oneOffExpenses}
//           onExpensesChange={setOneOffExpenses}
//           frequencyLabel="one-time"
//         />
//
//         <CostBreakdown totalAnnualExpenses={totalAnnual} />
//
//         <button onClick={() => setShowEmailCapture(true)}>
//           Get My Plan
//         </button>
//
//         <EmailCapture
//           isOpen={showEmailCapture}
//           onClose={() => setShowEmailCapture(false)}
//           onSubmit={async (email) => { /* send email */ }}
//           onPrint={() => { /* generate PDF */ }}
//         />
//       </div>
//     </main>
//   )
// }

export {}
