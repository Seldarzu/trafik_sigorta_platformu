-- V1__init_schema.sql
-- 1. customers tablosu
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  birth_date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  tc_no VARCHAR(11) NOT NULL UNIQUE,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  risk_profile VARCHAR(255) NOT NULL DEFAULT 'LOW',
  customer_value VARCHAR(255) NOT NULL DEFAULT 'BRONZE'
);

-- 2. drivers tablosu
CREATE TABLE IF NOT EXISTS drivers (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(255)
);

-- 3. notification_settings tablosu
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id BIGINT PRIMARY KEY,
  email_notifications BOOLEAN,
  push_notifications BOOLEAN,
  sms_notifications BOOLEAN
);

-- 4. notifications tablosu
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMP,
  is_read BOOLEAN,
  message VARCHAR(255),
  type VARCHAR(255)
);

-- 5. quotes tablosu
CREATE TABLE IF NOT EXISTS quotes (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  premium_amount NUMERIC(10,2) NOT NULL,
  risk_score INTEGER,
  status VARCHAR(255) NOT NULL,
  ref_no VARCHAR(20) NOT NULL UNIQUE,
  customer_id BIGINT NOT NULL,
  unique_ref_no VARCHAR(255) NOT NULL,
  CONSTRAINT fk_quotes_customer FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- 6. system_settings tablosu
CREATE TABLE IF NOT EXISTS system_settings (
  id BIGINT PRIMARY KEY,
  agency_code VARCHAR(255),
  agency_name VARCHAR(255),
  is_active BOOLEAN,
  join_date DATE,
  last_login DATE,
  license_number VARCHAR(255)
);

-- 7. users tablosu
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

-- 8. vehicles tablosu
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  brand VARCHAR(255),
  model VARCHAR(255),
  plate_number VARCHAR(255) NOT NULL,
  year INTEGER
);
