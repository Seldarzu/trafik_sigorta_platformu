-- 1) Eski constraint’i kaldır
ALTER TABLE quotes
  DROP CONSTRAINT IF EXISTS quotes_status_check;

-- 2) Yeniden ekle, enum’un tüm değerlerini BÜYÜK harfle gir
ALTER TABLE quotes
  ADD CONSTRAINT quotes_status_check
  CHECK (status IN (
    'DRAFT',
    'PENDING',
    'ACTIVE',
    'EXPIRED',
    'SOLD'
  ));
