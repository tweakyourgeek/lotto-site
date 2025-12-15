# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Lottery Reality Check calculator.

## Quick Setup

### 1. Create Database

```bash
# If using local PostgreSQL
createdb lottery_calculator

# Or connect to your hosted database
```

### 2. Run Schema

```bash
psql lottery_calculator < lib/db/schema.sql
```

### 3. Verify Setup

```sql
-- Connect to database
psql lottery_calculator

-- Check tables were created
\dt

-- Should see:
-- sessions
-- debt_selections
-- lifestyle_selections
-- email_captures

-- Check views
\dv

-- Should see:
-- analytics_summary
-- popular_debts
-- popular_lifestyle
-- state_distribution
-- daily_stats
```

## Hosted Database Options

### Vercel Postgres

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create database
vercel postgres create lottery-calculator

# Get connection string
vercel env pull
```

Then run the schema in Vercel dashboard:
1. Go to Storage tab
2. Select your database
3. Go to Query tab
4. Paste contents of `lib/db/schema.sql`
5. Execute

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Create new query
4. Paste contents of `lib/db/schema.sql`
5. Run query
6. Copy connection string from Settings > Database
7. Add to `.env`:

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

### Railway

1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy DATABASE_URL from variables
4. Connect via CLI or web interface
5. Run schema:

```bash
railway run psql $DATABASE_URL < lib/db/schema.sql
```

### Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Go to SQL Editor
4. Paste schema SQL
5. Execute
6. Copy connection string
7. Add to `.env`

## Schema Overview

### Tables

#### sessions
Main table tracking each calculator use.

```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    jackpot BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    payout_type VARCHAR(20) NOT NULL,
    net_take_home BIGINT,
    debts_cleared BIGINT,
    lifestyle_dreams BIGINT,
    investment_amount BIGINT,
    completed BOOLEAN DEFAULT FALSE,
    email_captured BOOLEAN DEFAULT FALSE
);
```

#### debt_selections
Tracks which debt categories users select.

```sql
CREATE TABLE debt_selections (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id),
    debt_id VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### lifestyle_selections
Tracks which lifestyle categories users select.

```sql
CREATE TABLE lifestyle_selections (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id),
    lifestyle_id VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### email_captures
Tracks email signups (opt-in only).

```sql
CREATE TABLE email_captures (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, email)
);
```

### Views

Views provide pre-aggregated analytics data:

- **analytics_summary**: Overall stats
- **popular_debts**: Most selected debt categories
- **popular_lifestyle**: Most selected lifestyle categories
- **state_distribution**: Usage by state
- **daily_stats**: Daily activity trends

## Sample Queries

### Get conversion rate

```sql
SELECT
    total_sessions,
    email_captures,
    ROUND((email_captures::numeric / total_sessions * 100), 2) as conversion_rate
FROM analytics_summary;
```

### Top 5 debt categories

```sql
SELECT debt_id, selection_count, avg_amount
FROM popular_debts
LIMIT 5;
```

### Today's activity

```sql
SELECT *
FROM daily_stats
WHERE date = CURRENT_DATE;
```

### Average jackpot by state

```sql
SELECT
    state,
    COUNT(*) as uses,
    AVG(jackpot) as avg_jackpot,
    AVG(net_take_home) as avg_take_home
FROM sessions
GROUP BY state
ORDER BY uses DESC
LIMIT 10;
```

## Maintenance

### Backup Database

```bash
# Local backup
pg_dump lottery_calculator > backup_$(date +%Y%m%d).sql

# Restore from backup
psql lottery_calculator < backup_20250101.sql
```

### Clean Old Sessions (Optional)

```sql
-- Delete sessions older than 90 days
DELETE FROM sessions
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Analyze Query Performance

```sql
-- Get slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Reindex Tables

```sql
-- If performance degrades over time
REINDEX TABLE sessions;
REINDEX TABLE debt_selections;
REINDEX TABLE lifestyle_selections;
REINDEX TABLE email_captures;
```

## Security Best Practices

1. **Use Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/db
   ```

2. **Restrict Database User Permissions**
   ```sql
   CREATE USER lottery_app WITH PASSWORD 'secure_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lottery_app;
   ```

3. **Enable SSL** (for production)
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
   ```

4. **Regular Backups**
   - Set up automated daily backups
   - Test restore procedures
   - Store backups securely off-site

5. **Monitor Access**
   - Review connection logs regularly
   - Set up alerts for unusual activity
   - Use read replicas for analytics if high traffic

## Troubleshooting

### Connection Timeout

```javascript
// Increase timeout in lib/db/index.ts
connectionTimeoutMillis: 5000, // Increase from 2000
```

### Too Many Connections

```javascript
// Reduce pool size
max: 10, // Reduce from 20
```

### Slow Queries

```sql
-- Add indexes if needed
CREATE INDEX idx_sessions_state ON sessions(state);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
```

### Missing Tables

```bash
# Re-run schema
psql lottery_calculator < lib/db/schema.sql
```

## Scaling

### When to Scale

Watch for:
- Connection pool exhaustion
- Slow query times (> 100ms)
- High CPU/memory usage
- Growing dataset (> 1GB)

### Scaling Options

1. **Vertical Scaling**: Upgrade database instance size
2. **Connection Pooling**: Use PgBouncer
3. **Read Replicas**: Separate read/write traffic
4. **Partitioning**: Split large tables by date
5. **Caching**: Add Redis for frequent queries

## Export Data

### CSV Export

```sql
-- Export sessions to CSV
COPY (
    SELECT * FROM sessions
    WHERE created_at > NOW() - INTERVAL '30 days'
) TO '/tmp/sessions.csv' WITH CSV HEADER;

-- Export analytics summary
COPY (SELECT * FROM analytics_summary) TO '/tmp/analytics.csv' WITH CSV HEADER;
```

### JSON Export

```sql
-- Export as JSON
SELECT json_agg(row_to_json(t))
FROM (
    SELECT * FROM analytics_summary
) t;
```

## Privacy Compliance

The database is designed for privacy:

- ✅ No personal data beyond opted-in emails
- ✅ Anonymous session tracking
- ✅ Email opt-in only (not auto-collected)
- ✅ Can delete user data on request

### Delete User Data

```sql
-- Delete all data for an email
DELETE FROM email_captures WHERE email = 'user@example.com';
```

---

**Need Help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) or contact support.
