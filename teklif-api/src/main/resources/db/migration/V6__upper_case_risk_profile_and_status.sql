ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_risk_profile_check,
  ADD CONSTRAINT customers_risk_profile_check
    CHECK (risk_profile IN ('LOW','MEDIUM','HIGH'));


ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_status_check,
  ADD CONSTRAINT customers_status_check
    CHECK (status IN ('POTENTIAL','ACTIVE','INACTIVE'));
