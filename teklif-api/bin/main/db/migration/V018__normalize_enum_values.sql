-- V018__normalize_enum_values.sql
-- 1) ÖNCE tüm ilgili CHECK constraint'ları düşür
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_fuel_type_check;
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_usage_type_check;

ALTER TABLE drivers  DROP CONSTRAINT IF EXISTS drivers_gender_check;
ALTER TABLE drivers  DROP CONSTRAINT IF EXISTS drivers_marital_status_check;
ALTER TABLE drivers  DROP CONSTRAINT IF EXISTS drivers_education_check;

ALTER TABLE policies DROP CONSTRAINT IF EXISTS policies_status_check;
ALTER TABLE policies DROP CONSTRAINT IF EXISTS policies_payment_status_check;

-- 2) DEĞERLERİ TRIM + UPPER ile normalize et (yalnızca gerekirse güncelle)
-- vehicles
UPDATE vehicles
SET fuel_type = UPPER(TRIM(fuel_type))
WHERE fuel_type IS NOT NULL
  AND fuel_type <> UPPER(TRIM(fuel_type));

UPDATE vehicles
SET usage_type = UPPER(TRIM(usage_type))
WHERE usage_type IS NOT NULL
  AND usage_type <> UPPER(TRIM(usage_type));

-- drivers
UPDATE drivers
SET gender = UPPER(TRIM(gender))
WHERE gender IS NOT NULL
  AND gender <> UPPER(TRIM(gender));

UPDATE drivers
SET marital_status = UPPER(TRIM(marital_status))
WHERE marital_status IS NOT NULL
  AND marital_status <> UPPER(TRIM(marital_status));

UPDATE drivers
SET education = UPPER(TRIM(education))
WHERE education IS NOT NULL
  AND education <> UPPER(TRIM(education));

-- policies
UPDATE policies
SET status = UPPER(TRIM(status))
WHERE status IS NOT NULL
  AND status <> UPPER(TRIM(status));

UPDATE policies
SET payment_status = UPPER(TRIM(payment_status))
WHERE payment_status IS NOT NULL
  AND payment_status <> UPPER(TRIM(payment_status));

-- 3) YENİ CHECK constraint'ları ekle (hepsi UPPERCASE setleri kontrol ediyor)
ALTER TABLE vehicles ADD CONSTRAINT vehicles_fuel_type_check
  CHECK (fuel_type IN ('GASOLINE','DIESEL','LPG','ELECTRIC','HYBRID'));

ALTER TABLE vehicles ADD CONSTRAINT vehicles_usage_type_check
  CHECK (usage_type IN ('PERSONAL','COMMERCIAL','TAXI','TRUCK'));

ALTER TABLE drivers ADD CONSTRAINT drivers_gender_check
  CHECK (gender IN ('MALE','FEMALE'));

ALTER TABLE drivers ADD CONSTRAINT drivers_marital_status_check
  CHECK (marital_status IN ('SINGLE','MARRIED','DIVORCED','WIDOWED'));

ALTER TABLE drivers ADD CONSTRAINT drivers_education_check
  CHECK (education IN ('PRIMARY','SECONDARY','HIGH_SCHOOL','UNIVERSITY','POSTGRADUATE'));

ALTER TABLE policies ADD CONSTRAINT policies_status_check
  CHECK (status IN ('ACTIVE','EXPIRED','CANCELLED','PENDING'));

ALTER TABLE policies ADD CONSTRAINT policies_payment_status_check
  CHECK (payment_status IN ('PAID','PENDING','OVERDUE'));
