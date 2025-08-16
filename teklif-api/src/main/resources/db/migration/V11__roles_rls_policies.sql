-- App role for RLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
  END IF;
END $$;

-- RLS is NOT enabled on core tables by default in this setup
-- (İstersen tüm tablolara da açabiliriz. V4’te yeni tablolar için aktif.)

-- (Bu dosyada politika tanımlamıyor; V4’te tablo bazlı RLS/policy açılacak)
