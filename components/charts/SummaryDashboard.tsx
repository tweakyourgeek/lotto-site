'use client'

import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/calculations'

interface SummaryDashboardProps {
  netTakeHome: number
  debtsCleared: number
  lifestyleDreams: number
  invested: number
  projections: { year: number; value: number }[]
  payoutType: 'lump-sum' | 'annuity'
  jackpot: number
  annualExpenses: number
}

const COLORS = {
  debts: '#BC7C9C',
  lifestyle: '#C68A98',
  invested: '#B375A0',
  remaining: '#7A5980',
  expenses: '#C68A98',
  savings: '#B375A0',
}

// Custom label that only shows for segments > 8%
const renderCustomLabel = ({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
  if (percent < 0.08) return null // Don't show label for small segments

  const RADIAN = Math.PI / 180
  const radius = outerRadius + 25
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#3B3B58"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Calculate growth with annual contributions (for annuity)
function calculateAnnuityGrowth(annualContribution: number, annualReturn: number, years: number): number {
  let balance = 0
  for (let year = 0; year < years; year++) {
    balance = (balance + annualContribution) * (1 + annualReturn / 100)
  }
  return balance
}

export default function SummaryDashboard({
  netTakeHome,
  debtsCleared,
  lifestyleDreams,
  invested,
  projections,
  payoutType,
  jackpot,
  annualExpenses,
}: SummaryDashboardProps) {
  // Annuity calculations
  const annualAnnuityNet = netTakeHome / 30
  const yearlyContribution = Math.max(0, annualAnnuityNet - annualExpenses)
  const annuityValue30Years = calculateAnnuityGrowth(yearlyContribution, 7, 30)

  // Lump sum calculations
  const remaining = Math.max(0, netTakeHome - debtsCleared - lifestyleDreams - invested)
  const value30Years = projections[projections.length - 1]?.value || 0

  // ANNUITY MODE
  if (payoutType === 'annuity') {
    const annuityPieData = [
      { name: 'Annual Expenses', value: annualExpenses, color: COLORS.expenses },
      { name: 'Yearly to Invest', value: yearlyContribution, color: COLORS.savings },
    ].filter((item) => item.value > 0)

    // Generate annuity growth projections
    const annuityProjections = [0, 5, 10, 15, 20, 25, 30].map(year => ({
      year,
      value: year === 0 ? 0 : calculateAnnuityGrowth(yearlyContribution, 7, year),
    }))

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-8 text-center">
          Your Financial Picture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-dusty-rose to-mauve-pink rounded-xl p-4 md:p-6 text-white text-center">
            <p className="text-xs md:text-sm mb-1 opacity-90">Yearly Income (after taxes)</p>
            <div className="text-xl md:text-3xl font-bold">{formatCurrency(annualAnnuityNet)}</div>
          </div>
          <div className="bg-gradient-to-br from-light-lavender to-primary-purple rounded-xl p-4 md:p-6 text-white text-center">
            <p className="text-xs md:text-sm mb-1 opacity-90">Debts to Clear</p>
            <div className="text-xl md:text-3xl font-bold">{formatCurrency(debtsCleared)}</div>
          </div>
          <div className="bg-gradient-to-br from-primary-purple to-navy rounded-xl p-4 md:p-6 text-white text-center">
            <p className="text-xs md:text-sm mb-1 opacity-90">Portfolio in 30 Years</p>
            <div className="text-xl md:text-3xl font-bold">{formatCurrency(annuityValue30Years)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-navy mb-4 text-center">Your Yearly Breakdown</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={annuityPieData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {annuityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ECD7D5' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={50}
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold text-navy mb-4 text-center">Portfolio Growth (Investing {formatCurrency(yearlyContribution)}/yr)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={annuityProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  stroke="#3B3B58"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  stroke="#3B3B58"
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ECD7D5' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7A5980"
                  strokeWidth={3}
                  dot={{ fill: '#B375A0', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  // LUMP SUM MODE - original behavior
  const pieData = [
    { name: 'Debts Cleared', value: debtsCleared, color: COLORS.debts },
    { name: 'Dreams & Giving', value: lifestyleDreams, color: COLORS.lifestyle },
    { name: 'Invested', value: invested, color: COLORS.invested },
    { name: 'Remaining', value: remaining, color: COLORS.remaining },
  ].filter((item) => item.value > 0)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-8 text-center">
        Your Financial Picture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-dusty-rose to-mauve-pink rounded-xl p-4 md:p-6 text-white text-center">
          <p className="text-xs md:text-sm mb-1 opacity-90">Net Take-Home</p>
          <div className="text-xl md:text-3xl font-bold">{formatCurrency(netTakeHome)}</div>
        </div>
        <div className="bg-gradient-to-br from-light-lavender to-primary-purple rounded-xl p-4 md:p-6 text-white text-center">
          <p className="text-xs md:text-sm mb-1 opacity-90">Debts Cleared</p>
          <div className="text-xl md:text-3xl font-bold">{formatCurrency(debtsCleared)}</div>
        </div>
        <div className="bg-gradient-to-br from-primary-purple to-navy rounded-xl p-4 md:p-6 text-white text-center">
          <p className="text-xs md:text-sm mb-1 opacity-90">In 30 Years</p>
          <div className="text-xl md:text-3xl font-bold">{formatCurrency(value30Years)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-navy mb-4 text-center">Your Choices</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #ECD7D5' }}
              />
              <Legend
                verticalAlign="bottom"
                height={50}
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-navy mb-4 text-center">Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
              <XAxis
                dataKey="year"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                stroke="#3B3B58"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                stroke="#3B3B58"
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #ECD7D5' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7A5980"
                strokeWidth={3}
                dot={{ fill: '#B375A0', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
