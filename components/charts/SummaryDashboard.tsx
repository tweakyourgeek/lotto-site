'use client'

import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/calculations'

interface SummaryDashboardProps {
  netTakeHome: number
  debtsCleared: number
  lifestyleDreams: number
  invested: number
  projections: { year: number; value: number }[]
}

const COLORS = {
  debts: '#BC7C9C',
  lifestyle: '#C68A98',
  invested: '#B375A0',
  remaining: '#7A5980',
}

export default function SummaryDashboard({
  netTakeHome,
  debtsCleared,
  lifestyleDreams,
  invested,
  projections,
}: SummaryDashboardProps) {
  const remaining = Math.max(0, netTakeHome - debtsCleared - lifestyleDreams - invested)
  const value30Years = projections[projections.length - 1]?.value || 0

  const pieData = [
    { name: 'Debts Cleared', value: debtsCleared, color: COLORS.debts },
    { name: 'Lifestyle Dreams', value: lifestyleDreams, color: COLORS.lifestyle },
    { name: 'Invested', value: invested, color: COLORS.invested },
    { name: 'Remaining', value: remaining, color: COLORS.remaining },
  ].filter((item) => item.value > 0)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-8 text-center">
        Your Financial Picture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-dusty-rose to-mauve-pink rounded-xl p-6 text-white text-center">
          <p className="text-sm mb-2 opacity-90">Net Take-Home</p>
          <div className="text-3xl font-bold">{formatCurrency(netTakeHome)}</div>
        </div>
        <div className="bg-gradient-to-br from-light-lavender to-primary-purple rounded-xl p-6 text-white text-center">
          <p className="text-sm mb-2 opacity-90">Debts Cleared</p>
          <div className="text-3xl font-bold">{formatCurrency(debtsCleared)}</div>
        </div>
        <div className="bg-gradient-to-br from-primary-purple to-navy rounded-xl p-6 text-white text-center">
          <p className="text-sm mb-2 opacity-90">In 30 Years</p>
          <div className="text-3xl font-bold">{formatCurrency(value30Years)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-navy mb-4 text-center">Your Choices</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={true}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-navy mb-4 text-center">Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
              <XAxis
                dataKey="year"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                stroke="#3B3B58"
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                stroke="#3B3B58"
              />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7A5980"
                strokeWidth={3}
                dot={{ fill: '#B375A0', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
