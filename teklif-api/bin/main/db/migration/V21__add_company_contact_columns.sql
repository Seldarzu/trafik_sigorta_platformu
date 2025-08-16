-- V21__add_company_contact_columns.sql
ALTER TABLE insurance_companies
    ADD COLUMN IF NOT EXISTS code            VARCHAR(32),
    ADD COLUMN IF NOT EXISTS website_url     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS contact_phone   VARCHAR(64),
    ADD COLUMN IF NOT EXISTS logo_url        VARCHAR(255),
    ADD COLUMN IF NOT EXISTS rating          DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_reviews   INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_active       BOOLEAN NOT NULL DEFAULT TRUE;

-- Mevcut satırlar için default değerleri garantiye al
UPDATE insurance_companies
SET
    rating = COALESCE(rating, 0),
    total_reviews = COALESCE(total_reviews, 0),
    is_active = COALESCE(is_active, TRUE);
