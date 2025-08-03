DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent','manager','admin')),
  agency_name VARCHAR(255),
  agency_code VARCHAR(50),
  license_number VARCHAR(100),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  tc_number VARCHAR(11) UNIQUE,
  birth_date DATE,
  address TEXT,
  city VARCHAR(100),
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  total_policies INTEGER DEFAULT 0,
  total_premium DECIMAL(12,2) DEFAULT 0,
  last_policy_date TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'potential' 
    CHECK (status IN ('active','inactive','potential')),
  risk_profile VARCHAR(20) DEFAULT 'low' 
    CHECK (risk_profile IN ('low','medium','high')),
  customer_value VARCHAR(20) DEFAULT 'bronze' 
    CHECK (customer_value IN ('bronze','silver','gold','platinum')),
  notes TEXT,
  loyalty_points INTEGER DEFAULT 0,
  referral_count INTEGER DEFAULT 0,
  has_multiple_vehicles BOOLEAN DEFAULT false,
  average_claim_frequency DECIMAL(5,3) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  engine_size VARCHAR(10),
  fuel_type VARCHAR(20) 
    CHECK (fuel_type IN ('gasoline','diesel','lpg','electric','hybrid')),
  usage_type VARCHAR(20) 
    CHECK (usage_type IN ('personal','commercial','taxi','truck')),
  city_code VARCHAR(5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  tc_number VARCHAR(11) UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  license_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male','female')),
  marital_status VARCHAR(20) 
    CHECK (marital_status IN ('single','married','divorced','widowed')),
  education VARCHAR(20) 
    CHECK (education IN ('primary','secondary','high_school','university','postgraduate')),
  profession VARCHAR(100),
  has_accidents BOOLEAN DEFAULT false,
  accident_count INTEGER DEFAULT 0,
  has_violations BOOLEAN DEFAULT false,
  violation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  contact_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quotes (
  id VARCHAR(50) PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES insurance_companies(id) ON DELETE SET NULL,
  premium DECIMAL(12,2) NOT NULL,
  coverage_amount DECIMAL(15,2) NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  valid_until TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' 
    CHECK (status IN ('draft','active','expired','sold')),
  total_discount DECIMAL(12,2) DEFAULT 0,
  final_premium DECIMAL(12,2) NOT NULL,
  quote_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quote_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE CASCADE,
  discount_type VARCHAR(50) NOT NULL,
  discount_name VARCHAR(255) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES insurance_companies(id) ON DELETE SET NULL,
  premium DECIMAL(12,2) NOT NULL,
  final_premium DECIMAL(12,2) NOT NULL,
  coverage_amount DECIMAL(15,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('active','expired','cancelled','pending')),
  total_discount DECIMAL(12,2) DEFAULT 0,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  is_auto_renewal BOOLEAN DEFAULT false,
  renewal_date TIMESTAMPTZ,
  policy_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE policy_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  discount_type VARCHAR(50) NOT NULL,
  discount_name VARCHAR(255) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' 
    CHECK (type IN ('info','success','warning','error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  action_text VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  quote_expiry BOOLEAN DEFAULT true,
  new_customer BOOLEAN DEFAULT true,
  policy_renewal BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  weekly_reports BOOLEAN DEFAULT true,
  monthly_reports BOOLEAN DEFAULT true,
  language VARCHAR(5) DEFAULT 'tr',
  timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',
  currency VARCHAR(5) DEFAULT 'TRY',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  theme VARCHAR(20) DEFAULT 'light' 
    CHECK (theme IN ('light','dark','auto')),
  auto_save BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string' 
    CHECK (setting_type IN ('string','number','boolean','json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicle_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES vehicle_brands(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id,name)
);

CREATE TABLE professions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  risk_factor DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(5) UNIQUE NOT NULL,
  region VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tc_number ON customers(tc_number);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_customer_value ON customers(customer_value);
CREATE INDEX idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_drivers_tc_number ON drivers(tc_number);
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_valid_until ON quotes(valid_until);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_policies_customer_id ON policies(customer_id);
CREATE INDEX idx_policies_policy_number ON policies(policy_number);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_end_date ON policies(end_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type,entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO insurance_companies(name,code) VALUES
('Anadolu Sigorta','ANADOLU'),
('Aksigorta','AKSIGORTA'),
('Allianz Sigorta','ALLIANZ'),
('Mapfre Sigorta','MAPFRE'),
('Güneş Sigorta','GUNES'),
('HDI Sigorta','HDI');

INSERT INTO vehicle_brands(name) VALUES
('Toyota'),('Volkswagen'),('Ford'),('Renault'),('Opel'),
('Peugeot'),('Fiat'),('Hyundai'),('Nissan'),('Honda'),
('BMW'),('Mercedes-Benz'),('Audi'),('Skoda'),('Seat'),
('Citroën'),('Kia'),('Mazda'),('Volvo'),('Dacia');

INSERT INTO professions(name,risk_factor) VALUES
('Mühendis',0.9),('Öğretmen',0.8),('Doktor',0.8),('Hemşire',0.9),
('Avukat',1.0),('Muhasebeci',0.9),('İşçi',1.1),('Memur',0.9),
('Emekli',0.8),('Öğrenci',1.2),('Ev Hanımı',0.8),('Serbest Meslek',1.0),
('İşveren',1.0),('Esnaf',1.1),('Çiftçi',1.2),('Şoför',1.3);

INSERT INTO cities(name,code,region) VALUES
('İstanbul','34','Marmara'),('Ankara','06','İç Anadolu'),
('İzmir','35','Ege'),('Bursa','16','Marmara'),
('Antalya','07','Akdeniz'),('Adana','01','Akdeniz'),
('Konya','42','İç Anadolu'),('Gaziantep','27','Güneydoğu Anadolu'),
('Mersin','33','Akdeniz'),('Kayseri','38','İç Anadolu');

INSERT INTO system_settings(setting_key,setting_value,setting_type,description,is_public) VALUES
('app_name','SigortaTeklif Pro','string','Uygulama adı',true),
('app_version','1.0.0','string','Uygulama versiyonu',true),
('max_quote_validity_days','30','number','Teklif geçerlilik süresi (gün)',false),
('default_coverage_amount','500000','number','Varsayılan teminat tutarı',false),
('enable_sms_notifications','true','boolean','SMS bildirimleri aktif',false),
('enable_email_notifications','true','boolean','Email bildirimleri aktif',false);
