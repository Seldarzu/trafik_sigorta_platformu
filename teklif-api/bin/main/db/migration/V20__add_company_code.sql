ALTER TABLE insurance_companies ADD COLUMN IF NOT EXISTS code VARCHAR(32);
UPDATE insurance_companies
SET code = CONCAT('C', SUBSTRING(REPLACE(id::text,'-',''), 1, 5))
WHERE code IS NULL;
ALTER TABLE insurance_companies ALTER COLUMN code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uk_ins_company_code ON insurance_companies(code);
