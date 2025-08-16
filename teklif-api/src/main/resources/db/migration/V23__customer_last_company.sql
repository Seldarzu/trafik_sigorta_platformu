ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_company_id UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_company_name VARCHAR(255);
