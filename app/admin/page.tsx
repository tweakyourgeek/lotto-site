'use client'

import { useEffect, useState } from 'react'
import { UserButton, useAuth } from '@clerk/nextjs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/calculations'

const COLORS = ['#7A5980', '#BC7C9C', '#C68A98', '#B375A0', '#ECD7D5']

function AdminContent() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [debts, setDebts] = useState<any[]>([])
  const [lifestyle, setLifestyle] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [analyticsRes, debtsRes, lifestyleRes, statesRes, dailyRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/debts'),
        fetch('/api/admin/lifestyle'),
        fetch('/api/admin/states'),
        fetch('/api/admin/daily'),
      ])

      setAnalytics(await analyticsRes.json())
      setDebts(await debtsRes.json())
      setLifestyle(await lifestyleRes.json())
      setStates(await statesRes.json())
      setDailyStats(await dailyRes.json())
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-blush">
        <div className="text-2xl text-primary-purple">Loading analytics...</div>
      </div>
    )
  }

  const conversionRate = analytics?.total_sessions
    ? ((analytics.email_captures / analytics.total_sessions) * 100).toFixed(1)
    : '0'

  const completionRate = analytics?.total_sessions
    ? ((analytics.completed_sessions / analytics.total_sessions) * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-light-blush py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-purple">Analytics Dashboard</h1>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatNumber(analytics?.total_sessions || 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Email Captures</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatNumber(analytics?.email_captures || 0)}
            </p>
            <p className="text-sm text-mauve-pink mt-1">{conversionRate}% conversion</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Completed Sessions</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatNumber(analytics?.completed_sessions || 0)}
            </p>
            <p className="text-sm text-mauve-pink mt-1">{completionRate}% completion</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Avg Jackpot</p>
            <p className="text-2xl font-bold text-primary-purple">
              {formatCurrency(analytics?.avg_jackpot || 0)}
            </p>
          </div>
        </div>

        {/* Daily Stats Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary-purple mb-4">Daily Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
              <XAxis dataKey="date" stroke="#3B3B58" />
              <YAxis stroke="#3B3B58" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#7A5980" strokeWidth={2} name="Sessions" />
              <Line type="monotone" dataKey="completed" stroke="#BC7C9C" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="emails" stroke="#B375A0" strokeWidth={2} name="Emails" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Debts */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-primary-purple mb-4">Popular Debt Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={debts.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
                <XAxis dataKey="debt_id" stroke="#3B3B58" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#3B3B58" />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Bar dataKey="selection_count" fill="#7A5980" name="Selections" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <h3 className="font-semibold text-navy mb-2">Average Amounts:</h3>
              <div className="space-y-2 text-sm">
                {debts.slice(0, 5).map((debt: any) => (
                  <div key={debt.debt_id} className="flex justify-between">
                    <span className="text-navy/70">{debt.debt_id}:</span>
                    <span className="font-semibold">{formatCurrency(debt.avg_amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Lifestyle */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-primary-purple mb-4">Popular Lifestyle Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lifestyle.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECD7D5" />
                <XAxis dataKey="lifestyle_id" stroke="#3B3B58" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#3B3B58" />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Bar dataKey="selection_count" fill="#BC7C9C" name="Selections" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <h3 className="font-semibold text-navy mb-2">Average Amounts:</h3>
              <div className="space-y-2 text-sm">
                {lifestyle.slice(0, 5).map((item: any) => (
                  <div key={item.lifestyle_id} className="flex justify-between">
                    <span className="text-navy/70">{item.lifestyle_id}:</span>
                    <span className="font-semibold">{formatCurrency(item.avg_amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* State Distribution */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary-purple mb-4">Top States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {states.slice(0, 8).map((state: any, index: number) => (
              <div key={state.state} className="bg-light-blush rounded-lg p-4">
                <p className="text-sm text-navy/60">#{index + 1}</p>
                <p className="font-semibold text-navy">{state.state}</p>
                <p className="text-2xl font-bold text-primary-purple">{state.session_count}</p>
                <p className="text-xs text-mauve-pink mt-1">
                  Avg: {formatCurrency(state.avg_net_take_home)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Averages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Avg Debts Cleared</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatCurrency(analytics?.avg_debts_cleared || 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Avg Lifestyle Dreams</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatCurrency(analytics?.avg_lifestyle_dreams || 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-navy/60 mb-1">Avg Investment</p>
            <p className="text-3xl font-bold text-primary-purple">
              {formatCurrency(analytics?.avg_investment_amount || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If Clerk isn't configured, show setup instructions
  if (!hasClerkKeys) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-blush">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-primary-purple mb-4">
            Authentication Required
          </h1>
          <p className="text-navy mb-6">
            Clerk authentication is not configured. Add your Clerk keys to Vercel to enable secure admin access.
          </p>
          <div className="text-left bg-light-blush p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Required environment variables:</p>
            <code className="block text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>
            <code className="block text-xs">CLERK_SECRET_KEY</code>
          </div>
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 bg-primary-purple text-white rounded-lg hover:bg-light-lavender transition-colors"
          >
            Get Clerk Keys
          </a>
        </div>
      </div>
    )
  }

  return <AdminContent />
}
