CREATE TABLE IF NOT EXISTS max_bot_sessions (
    user_id BIGINT PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    step VARCHAR(32) NOT NULL DEFAULT 'idle',
    service TEXT,
    client_name TEXT,
    phone TEXT,
    preferred_time TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);