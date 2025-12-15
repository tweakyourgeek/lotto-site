-- Database Schema for Lottery Reality Check Analytics

-- Sessions table - tracks each calculator use
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Calculator inputs
    jackpot BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    payout_type VARCHAR(20) NOT NULL,

    -- Calculated values
    net_take_home BIGINT,
    debts_cleared BIGINT,
    lifestyle_dreams BIGINT,
    investment_amount BIGINT,

    -- Completion tracking
    completed BOOLEAN DEFAULT FALSE,
    email_captured BOOLEAN DEFAULT FALSE
);

-- Debt selections table
CREATE TABLE IF NOT EXISTS debt_selections (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    debt_id VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lifestyle selections table
CREATE TABLE IF NOT EXISTS lifestyle_selections (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    lifestyle_id VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email captures table
CREATE TABLE IF NOT EXISTS email_captures (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicate emails per session
    UNIQUE(session_id, email)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(state);
CREATE INDEX IF NOT EXISTS idx_debt_selections_session_id ON debt_selections(session_id);
CREATE INDEX IF NOT EXISTS idx_debt_selections_debt_id ON debt_selections(debt_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_selections_session_id ON lifestyle_selections(session_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_selections_lifestyle_id ON lifestyle_selections(lifestyle_id);
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);

-- View for analytics dashboard
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
    COUNT(DISTINCT s.session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN s.completed THEN s.session_id END) as completed_sessions,
    COUNT(DISTINCT CASE WHEN s.email_captured THEN s.session_id END) as email_captures,
    AVG(s.jackpot) as avg_jackpot,
    AVG(s.debts_cleared) as avg_debts_cleared,
    AVG(s.lifestyle_dreams) as avg_lifestyle_dreams,
    AVG(s.investment_amount) as avg_investment_amount
FROM sessions s;

-- View for popular debt categories
CREATE OR REPLACE VIEW popular_debts AS
SELECT
    debt_id,
    COUNT(*) as selection_count,
    AVG(amount) as avg_amount,
    SUM(amount) as total_amount
FROM debt_selections
GROUP BY debt_id
ORDER BY selection_count DESC;

-- View for popular lifestyle categories
CREATE OR REPLACE VIEW popular_lifestyle AS
SELECT
    lifestyle_id,
    COUNT(*) as selection_count,
    AVG(amount) as avg_amount,
    SUM(amount) as total_amount
FROM lifestyle_selections
GROUP BY lifestyle_id
ORDER BY selection_count DESC;

-- View for state distribution
CREATE OR REPLACE VIEW state_distribution AS
SELECT
    state,
    COUNT(*) as session_count,
    AVG(net_take_home) as avg_net_take_home
FROM sessions
GROUP BY state
ORDER BY session_count DESC;

-- View for daily stats
CREATE OR REPLACE VIEW daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(DISTINCT CASE WHEN completed THEN session_id END) as completed,
    COUNT(DISTINCT CASE WHEN email_captured THEN session_id END) as emails
FROM sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;
