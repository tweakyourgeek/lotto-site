import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export interface SessionData {
  jackpot: number
  state: string
  payoutType: string
  debtsCleared: number
  lifestyleDreams: number
  investmentAmount: number
  debts: Array<{ id: string; amount: number }>
  lifestyle: Array<{ id: string; amount: number }>
}

export async function createOrUpdateSession(sessionId: string, data: SessionData) {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Upsert session
    const sessionResult = await client.query(
      `INSERT INTO sessions (session_id, jackpot, state, payout_type, debts_cleared, lifestyle_dreams, investment_amount, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (session_id)
       DO UPDATE SET
         jackpot = EXCLUDED.jackpot,
         state = EXCLUDED.state,
         payout_type = EXCLUDED.payout_type,
         debts_cleared = EXCLUDED.debts_cleared,
         lifestyle_dreams = EXCLUDED.lifestyle_dreams,
         investment_amount = EXCLUDED.investment_amount,
         updated_at = CURRENT_TIMESTAMP
       RETURNING session_id`,
      [data.jackpot, data.state, data.payoutType, data.debtsCleared, data.lifestyleDreams, data.investmentAmount, sessionId]
    )

    // Delete existing debt/lifestyle selections for this session
    await client.query('DELETE FROM debt_selections WHERE session_id = $1', [sessionId])
    await client.query('DELETE FROM lifestyle_selections WHERE session_id = $1', [sessionId])

    // Insert debt selections
    for (const debt of data.debts) {
      await client.query(
        'INSERT INTO debt_selections (session_id, debt_id, amount) VALUES ($1, $2, $3)',
        [sessionId, debt.id, debt.amount]
      )
    }

    // Insert lifestyle selections
    for (const lifestyle of data.lifestyle) {
      await client.query(
        'INSERT INTO lifestyle_selections (session_id, lifestyle_id, amount) VALUES ($1, $2, $3)',
        [sessionId, lifestyle.id, lifestyle.amount]
      )
    }

    await client.query('COMMIT')
    return sessionResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function captureEmail(sessionId: string, email: string) {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Insert email capture
    await client.query(
      'INSERT INTO email_captures (session_id, email) VALUES ($1, $2) ON CONFLICT (session_id, email) DO NOTHING',
      [sessionId, email]
    )

    // Update session
    await client.query(
      'UPDATE sessions SET email_captured = TRUE, completed = TRUE WHERE session_id = $1',
      [sessionId]
    )

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getAnalyticsSummary() {
  const pool = getPool()
  const result = await pool.query('SELECT * FROM analytics_summary')
  return result.rows[0]
}

export async function getPopularDebts() {
  const pool = getPool()
  const result = await pool.query('SELECT * FROM popular_debts')
  return result.rows
}

export async function getPopularLifestyle() {
  const pool = getPool()
  const result = await pool.query('SELECT * FROM popular_lifestyle')
  return result.rows
}

export async function getStateDistribution() {
  const pool = getPool()
  const result = await pool.query('SELECT * FROM state_distribution')
  return result.rows
}

export async function getDailyStats(days = 30) {
  const pool = getPool()
  const result = await pool.query('SELECT * FROM daily_stats LIMIT $1', [days])
  return result.rows
}
