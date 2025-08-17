-- V019__quotes_risk_level_uppercase.sql

-- 1) Eski CHECK kısıtını kaldır
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_risk_level_check;

-- 2) Mevcut veriyi BÜYÜK harfe çevir
UPDATE quotes
SET risk_level = UPPER(risk_level);

-- 3) CHECK kısıtını uppercase değerlerle yeniden oluştur
ALTER TABLE quotes
  ADD CONSTRAINT quotes_risk_level_check
  CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'));
