-- 1) QUOTES: coverage_details + selected_company_id
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS coverage_details JSONB DEFAULT '{
    "personalInjuryPerPerson": 500000,
    "personalInjuryPerAccident": 1000000,
    "propertyDamage": 200000,
    "medicalExpenses": 50000,
    "legalProtection": true,
    "roadAssistance": false,
    "replacementVehicle": false,
    "personalAccident": 0
  }';

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS selected_company_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_quotes_selected_company'
  ) THEN
    ALTER TABLE quotes
      ADD CONSTRAINT fk_quotes_selected_company
      FOREIGN KEY (selected_company_id) REFERENCES insurance_companies(id) ON DELETE SET NULL;
  END IF;
END$$;

-- 2) POLICIES: payment_status (+ opsiyonel payment_method check)
ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'policies_payment_status_check'
  ) THEN
    ALTER TABLE policies
      ADD CONSTRAINT policies_payment_status_check
      CHECK (payment_status IN ('paid','pending','overdue','cancelled'));
  END IF;
END$$;

ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'policies_payment_method_check'
  ) THEN
    ALTER TABLE policies
      ADD CONSTRAINT policies_payment_method_check
      CHECK (payment_method IN ('credit_card','bank_transfer','cash','installment'));
  END IF;
END$$;

-- 3) VEHICLES: kod "usage" bekliyor, sende "usage_type" vardı → rename veya ekle
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='vehicles' AND column_name='usage_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='vehicles' AND column_name='usage'
  ) THEN
    ALTER TABLE vehicles RENAME COLUMN usage_type TO "usage";
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='vehicles' AND column_name='usage'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN "usage" VARCHAR(20)
      CHECK ("usage" IN ('personal','commercial','taxi','truck'));
  END IF;
END$$;

-- 4) system_settings_kv: kod bu tabloyu okuyor; mevcut system_settings'ten görünüm oluşturalım
DROP VIEW IF EXISTS system_settings_kv;
CREATE VIEW system_settings_kv AS
SELECT
  id,
  setting_key,
  setting_value,
  setting_type,
  description,
  is_public,
  created_at,
  updated_at
FROM system_settings;
