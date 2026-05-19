CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    service VARCHAR(255) DEFAULT '',
    comment TEXT DEFAULT '',
    booking_date VARCHAR(60) DEFAULT '',
    booking_time VARCHAR(20) DEFAULT '',
    status VARCHAR(30) DEFAULT 'new',
    source VARCHAR(40) DEFAULT 'site',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
