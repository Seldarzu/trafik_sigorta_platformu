-- === Comparison Module ===
CREATE TABLE IF NOT EXISTS company_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_quote_id VARCHAR(50) NOT NULL REFERENCES quotes(id) ON DELETE CASCADE, -- FK yaptık
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id  UUID REFERENCES drivers(id) ON DELETE CASCADE,

  base_premium DECIMAL(12,2) NOT NULL,
  total_discount DECIMAL(12,2) DEFAULT 0,
  final_premium DECIMAL(12,2) NOT NULL,

  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  risk_factors JSONB DEFAULT '[]',

  -- DİKKAT: DEFAULT quotes.coverage_details KALDIRILDI
  coverage_details JSONB NOT NULL,

  policy_terms JSONB DEFAULT '{}',
  special_conditions TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  is_recommended BOOLEAN DEFAULT false,
  recommendation_score DECIMAL(5,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INSERT sırasında coverage_details'i quotes'tan çeken trigger
CREATE OR REPLACE FUNCTION trg_fill_company_quotes_coverage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coverage_details IS NULL THEN
    SELECT q.coverage_details
      INTO NEW.coverage_details
      FROM quotes q
     WHERE q.id = NEW.base_quote_id;

    -- Eğer ilgili quote bulunamazsa (FK sayesinde zaten bulunmalı), en azından boş jsonb verelim
    IF NEW.coverage_details IS NULL THEN
      NEW.coverage_details := '{}'::jsonb;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fill_company_quotes_coverage ON company_quotes;
CREATE TRIGGER fill_company_quotes_coverage
BEFORE INSERT ON company_quotes
FOR EACH ROW
EXECUTE FUNCTION trg_fill_company_quotes_coverage();

-- updated_at için trigger varsayımı (projede mevcutsa)
-- DROP TRIGGER IF EXISTS update_company_quotes_updated_at ON company_quotes;
-- CREATE TRIGGER update_company_quotes_updated_at
--   BEFORE UPDATE ON company_quotes
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
