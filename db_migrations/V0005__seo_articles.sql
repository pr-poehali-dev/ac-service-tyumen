CREATE TABLE IF NOT EXISTS seo_articles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(160) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(80) DEFAULT 'Статья',
    seo_description TEXT,
    keywords TEXT,
    intro TEXT,
    sections JSONB NOT NULL DEFAULT '[]',
    image TEXT,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seo_articles_published ON seo_articles(published, created_at DESC);