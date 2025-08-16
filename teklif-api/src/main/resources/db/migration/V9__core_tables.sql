-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  phone      VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent','manager','admin')),
  agency_name VARCHAR(255),
  agency_code VARCHAR(50),
  license_number VARCHAR(100),
  join_date  TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  tc_number VARCHAR(11) UNIQUE,
  birth_date DATE,
  address TEXT,
  city VARCHAR(100),
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  total_policies INTEGER DEFAULT 0,
  total_premium  DECIMAL(12,2) DEFAULT 0,
  last_policy_date TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'potential' CHECK (status IN ('active','inactive','potential')),
  risk_profile VARCHAR(20) DEFAULT 'low' CHECK (risk_profile IN ('low','medium','high')),
  customer_value VARCHAR(20) DEFAULT 'bronze' CHECK (customer_value IN ('bronze','silver','gold','platinum')),
  notes TEXT,
  loyalty_points INTEGER DEFAULT 0,
  referral_count INTEGER DEFAULT 0,
  has_multiple_vehicles BOOLEAN DEFAULT false,
  average_claim_frequency DECIMAL(5,3) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year  INTEGER NOT NULL,
  engine_size VARCHAR(10),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline','diesel','lpg','electric','hybrid')),
  usage_type VARCHAR(20) CHECK (usage_type IN ('personal','commercial','taxi','truck')),
  city_code VARCHAR(5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DRIVERS
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  tc_number  VARCHAR(11) UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  license_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male','female')),
  marital_status VARCHAR(20) CHECK (marital_status IN ('single','married','divorced','widowed')),
  education VARCHAR(20) CHECK (education IN ('primary','secondary','high_school','university','postgraduate')),
  profession VARCHAR(100),
  has_accidents BOOLEAN DEFAULT false,
  accident_count INTEGER DEFAULT 0,
  has_violations BOOLEAN DEFAULT false,
  violation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSURANCE COMPANIES
CREATE TABLE IF NOT EXISTS insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  contact_info JSONB,
  logo_url TEXT,
  website_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTES
CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(50) PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id  UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id   UUID REFERENCES drivers(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id  UUID REFERENCES insurance_companies(id) ON DELETE SET NULL,
  premium DECIMAL(12,2) NOT NULL,
  coverage_amount DECIMAL(15,2) NOT NULL,
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  valid_until TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','active','expired','sold')),
  total_discount DECIMAL(12,2) DEFAULT 0,
  final_premium DECIMAL(12,2) NOT NULL,
  special_conditions TEXT,
  is_recommended BOOLEAN DEFAULT false,
  recommendation_score DECIMAL(5,2) DEFAULT 0,
  coverage_details JSONB DEFAULT '{
    "personalInjuryPerPerson": 500000,
    "personalInjuryPerAccident": 1000000,
    "propertyDamage": 200000,
    "medicalExpenses": 50000,
    "legalProtection": true,
    "roadAssistance": false,
    "replacementVehicle": false,
    "personalAccident": 0
  }',
  quote_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE CASCADE,
  discount_type VARCHAR(50) NOT NULL,
  discount_name VARCHAR(255) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- POLICIES
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  quote_id    VARCHAR(50) REFERENCES quotes(id) ON DELETE SET NULL,
  vehicle_id  UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id   UUID REFERENCES drivers(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id  UUID REFERENCES insurance_companies(id) ON DELETE SET NULL,
  premium DECIMAL(12,2) NOT NULL,
  final_premium DECIMAL(12,2) NOT NULL,
  coverage_amount DECIMAL(15,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date   TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active','expired','cancelled','pending')),
  total_discount DECIMAL(12,2) DEFAULT 0,
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  is_auto_renewal BOOLEAN DEFAULT false,
  renewal_date TIMESTAMPTZ,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('paid','pending','overdue','cancelled')),
  payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card','bank_transfer','cash','installment')),
  coverage_details JSONB DEFAULT quotes.coverage_details,
  policy_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  discount_type VARCHAR(50) NOT NULL,
  discount_name VARCHAR(255) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  action_text VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications   BOOLEAN DEFAULT true,
  push_notifications  BOOLEAN DEFAULT true,
  quote_expiry BOOLEAN DEFAULT true,
  new_customer BOOLEAN DEFAULT true,
  policy_renewal BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  weekly_reports  BOOLEAN DEFAULT true,
  monthly_reports BOOLEAN DEFAULT true,
  language VARCHAR(5)  DEFAULT 'tr',
  timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',
  currency VARCHAR(5)  DEFAULT 'TRY',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light','dark','auto')),
  auto_save BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string','number','boolean','json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUPPORT TABLES
CREATE TABLE IF NOT EXISTS vehicle_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES vehicle_brands(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id,name)
);

CREATE TABLE IF NOT EXISTS professions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  risk_factor DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(5) UNIQUE NOT NULL,
  region VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id   VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
