ALTER TABLE quotes DROP CONSTRAINT quotes_status_check;
ALTER TABLE quotes
  ADD CONSTRAINT quotes_status_check
  CHECK (status IN ('draft','pending','active','expired','sold'));
