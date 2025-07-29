-- 1. Kolonları nullable ekleyin (NOT NULL yok)
ALTER TABLE customers
  ADD COLUMN first_name VARCHAR(255),
  ADD COLUMN last_name  VARCHAR(255),
  ADD COLUMN email      VARCHAR(255),
  ADD COLUMN address    VARCHAR(500),
  ADD COLUMN city       VARCHAR(100),
  ADD COLUMN status     VARCHAR(20)    NOT NULL DEFAULT 'potential',
  ADD COLUMN notes      TEXT;

-- 2. Eski kayıtları backfill edin.
--    Örnek: name sütununu boşlukla bölüp ilk kelimeyi first_name, gerisini last_name'e koyuyoruz.
UPDATE customers
SET
  first_name = split_part(name, ' ', 1),
  last_name  = coalesce(
                 nullif(
                   substring(name from position(' ' in name)+1),
                   ''
                 ),
                 ''
               );

-- 3. Şimdi NOT NULL kısıtını uygulayın
ALTER TABLE customers
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name  SET NOT NULL;
