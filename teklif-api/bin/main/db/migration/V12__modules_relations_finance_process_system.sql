-- === Comparison Module ===
CREATE TABLE IF NOT EXISTS company_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_quote_id VARCHAR(50) NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id  UUID REFERENCES drivers(id) ON DELETE CASCADE,
  base_premium DECIMAL(12,2) NOT NULL,
  total_discount DECIMAL(12,2) DEFAULT 0,
  final_premium DECIMAL(12,2) NOT NULL,
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high')),
  risk_factors JSONB DEFAULT '[]',
  -- DEFAULT quotes.coverage_details KALDIRILDI
  coverage_details JSONB NOT NULL,
  policy_terms JSONB DEFAULT '{}',
  special_conditions TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  is_recommended BOOLEAN DEFAULT false,
  recommendation_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INSERT sırasında coverage_details'i quotes'tan çeken trigger
CREATE OR REPLACE FUNCTION trg_fill_company_quotes_coverage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coverage_details IS NULL THEN
    SELECT q.coverage_details
      INTO NEW.coverage_details
      FROM quotes q
     WHERE q.id = NEW.base_quote_id;

    IF NEW.coverage_details IS NULL THEN
      NEW.coverage_details := '{}'::jsonb;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fill_company_quotes_coverage ON company_quotes;
CREATE TRIGGER fill_company_quotes_coverage
BEFORE INSERT ON company_quotes
FOR EACH ROW
EXECUTE FUNCTION trg_fill_company_quotes_coverage();

CREATE TABLE IF NOT EXISTS coverage_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('basic','standard','premium')),
  coverage_config JSONB NOT NULL,
  base_premium_multiplier DECIMAL(5,3) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  overall_rating DECIMAL(2,1) CHECK (overall_rating BETWEEN 1 AND 5),
  price_rating   DECIMAL(2,1) CHECK (price_rating   BETWEEN 1 AND 5),
  service_rating DECIMAL(2,1) CHECK (service_rating BETWEEN 1 AND 5),
  claim_process_rating DECIMAL(2,1) CHECK (claim_process_rating BETWEEN 1 AND 5),
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_quote_id VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  compared_companies UUID[] NOT NULL,
  selected_company_id UUID REFERENCES insurance_companies(id) ON DELETE SET NULL,
  comparison_criteria JSONB DEFAULT '{"price_weight":40,"coverage_weight":35,"service_weight":25}',
  comparison_results JSONB DEFAULT '{}',
  selection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  discount_type VARCHAR(50) NOT NULL,
  discount_name VARCHAR(255) NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  discount_percentage DECIMAL(5,2) NOT NULL,
  max_discount_amount DECIMAL(12,2),
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- === Relations ===
CREATE TABLE IF NOT EXISTS customer_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id  UUID REFERENCES vehicles(id)  ON DELETE CASCADE,
  relationship_type VARCHAR(50) DEFAULT 'owner' CHECK (relationship_type IN ('owner','user','authorized_driver')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, vehicle_id)
);

CREATE TABLE IF NOT EXISTS customer_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  driver_id  UUID REFERENCES drivers(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) DEFAULT 'self' CHECK (relationship_type IN ('self','spouse','child','parent','other')),
  is_primary BOOLEAN DEFAULT false,
  authorization_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, driver_id)
);

CREATE TABLE IF NOT EXISTS agent_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  assignment_date DATE DEFAULT CURRENT_DATE,
  is_primary_agent BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, customer_id)
);

-- === Finance ===
CREATE TABLE IF NOT EXISTS policy_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  late_fee DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(policy_id, installment_number)
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('policy','installment','claim')),
  entity_id VARCHAR(100) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('payment','refund','chargeback','fee')),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'TRY',
  payment_method VARCHAR(50) NOT NULL,
  payment_provider VARCHAR(100),
  transaction_reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','cancelled','refunded')),
  processed_at TIMESTAMPTZ,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  product_type VARCHAR(50) DEFAULT 'traffic_insurance',
  commission_type VARCHAR(50) DEFAULT 'percentage' CHECK (commission_type IN ('percentage','fixed_amount','tiered')),
  commission_rate DECIMAL(5,2),
  tier_config JSONB,
  minimum_commission DECIMAL(12,2),
  maximum_commission DECIMAL(12,2),
  payment_schedule VARCHAR(50) DEFAULT 'monthly' CHECK (payment_schedule IN ('immediate','monthly','quarterly','annually')),
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, company_id, product_type)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earned','redeemed','expired','bonus','penalty')),
  points INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  expiry_date DATE,
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- === Processes ===
CREATE TABLE IF NOT EXISTS policy_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  claim_number VARCHAR(100) UNIQUE NOT NULL,
  incident_date DATE NOT NULL,
  report_date   DATE NOT NULL,
  claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN ('accident','theft','damage','liability','fire','natural_disaster')),
  description TEXT NOT NULL,
  incident_location TEXT,
  police_report_number VARCHAR(100),
  estimated_amount DECIMAL(12,2),
  approved_amount  DECIMAL(12,2),
  paid_amount      DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported','investigating','approved','rejected','paid','closed')),
  adjuster_name VARCHAR(255),
  adjuster_phone VARCHAR(20),
  settlement_date DATE,
  documents TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  previous_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS policy_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  new_policy_id      UUID REFERENCES policies(id) ON DELETE CASCADE,
  renewal_date DATE NOT NULL,
  renewal_type VARCHAR(50) DEFAULT 'automatic' CHECK (renewal_type IN ('automatic','manual','modified')),
  premium_change DECIMAL(12,2) DEFAULT 0,
  coverage_changes JSONB,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(original_policy_id, new_policy_id)
);

CREATE TABLE IF NOT EXISTS customer_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('call','email','sms','meeting','whatsapp')),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound')),
  subject VARCHAR(255),
  content TEXT,
  duration_minutes INTEGER,
  outcome VARCHAR(100),
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('quote','policy','customer','driver','vehicle')),
  entity_id VARCHAR(100) NOT NULL,
  assessment_type VARCHAR(50) NOT NULL,
  risk_factors JSONB NOT NULL,
  calculated_score INTEGER CHECK (calculated_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low','medium','high','critical')),
  recommendations TEXT[],
  assessed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assessment_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('base_premium','risk_multiplier','discount','surcharge')),
  conditions JSONB NOT NULL,
  calculation_method VARCHAR(50) NOT NULL,
  value_config JSONB NOT NULL,
  priority INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_until DATE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('discount','cashback','gift','loyalty_bonus')),
  description TEXT,
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(12,2),
  target_criteria JSONB NOT NULL,
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  max_usage_count INTEGER,
  current_usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  discount_applied DECIMAL(12,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, customer_id, quote_id)
);

-- === System/Support ===
CREATE TABLE IF NOT EXISTS file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id   VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url  TEXT NOT NULL,
  file_path TEXT,
  upload_type VARCHAR(50) DEFAULT 'document' CHECK (upload_type IN ('document','image','signature','id_copy','license_copy')),
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_required BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_vehicle_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id  UUID REFERENCES vehicles(id)  ON DELETE CASCADE,
  ownership_start DATE NOT NULL,
  ownership_end   DATE,
  ownership_type VARCHAR(50) DEFAULT 'owner' CHECK (ownership_type IN ('owner','lessee','company_car','family_car')),
  purchase_price DECIMAL(12,2),
  current_value  DECIMAL(12,2),
  mileage INTEGER,
  condition_rating INTEGER CHECK (condition_rating BETWEEN 1 AND 5),
  modifications TEXT[],
  accident_history JSONB DEFAULT '[]',
  maintenance_records JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(255) NOT NULL,
  report_type   VARCHAR(50)  NOT NULL CHECK (report_type IN ('sales','performance','customer','financial','risk')),
  description TEXT,
  query_config JSONB NOT NULL,
  chart_config JSONB,
  schedule_config JSONB,
  recipients TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
  report_name VARCHAR(255) NOT NULL,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  file_url TEXT,
  file_size BIGINT,
  status VARCHAR(20) DEFAULT 'generating' CHECK (status IN ('generating','completed','failed','expired')),
  error_message TEXT,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  quotes_created INTEGER DEFAULT 0,
  quotes_converted INTEGER DEFAULT 0,
  policies_sold INTEGER DEFAULT 0,
  total_premium DECIMAL(15,2) DEFAULT 0,
  total_commission DECIMAL(15,2) DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  customer_retention_rate DECIMAL(5,2) DEFAULT 0,
  customer_satisfaction_score DECIMAL(3,2) DEFAULT 0,
  average_quote_time INTEGER,
  quote_accuracy_rate DECIMAL(5,2) DEFAULT 0,
  claim_ratio DECIMAL(5,2) DEFAULT 0,
  monthly_target DECIMAL(15,2),
  target_achievement_rate DECIMAL(5,2) DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, period_start, period_end)
);

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('DEBUG','INFO','WARN','ERROR','FATAL')),
  module VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50),
  entity_id   VARCHAR(100),
  message TEXT NOT NULL,
  error_details JSONB,
  request_data JSONB,
  response_data JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name VARCHAR(100) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method   VARCHAR(10)  NOT NULL,
  request_headers JSONB,
  request_body    JSONB,
  response_status INTEGER,
  response_headers JSONB,
  response_body    JSONB,
  execution_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for new tables (özet)
CREATE INDEX IF NOT EXISTS idx_company_quotes_base_quote ON company_quotes(base_quote_id);
CREATE INDEX IF NOT EXISTS idx_company_quotes_company    ON company_quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_company_quotes_customer   ON company_quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_company_quotes_final      ON company_quotes(final_premium);
CREATE INDEX IF NOT EXISTS idx_company_quotes_valid      ON company_quotes(valid_until);

CREATE INDEX IF NOT EXISTS idx_coverage_templates_company ON coverage_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_coverage_templates_type    ON coverage_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_coverage_templates_active  ON coverage_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_company_ratings_company ON company_ratings(company_id);
CREATE INDEX IF NOT EXISTS idx_company_ratings_overall ON company_ratings(overall_rating);
CREATE INDEX IF NOT EXISTS idx_company_ratings_created ON company_ratings(created_at);

CREATE INDEX IF NOT EXISTS idx_quote_comparisons_base  ON quote_comparisons(base_quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_comparisons_user  ON quote_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_comparisons_cust  ON quote_comparisons(customer_id);

CREATE INDEX IF NOT EXISTS idx_discount_rules_company ON company_discount_rules(company_id);
CREATE INDEX IF NOT EXISTS idx_discount_rules_type    ON company_discount_rules(discount_type);
CREATE INDEX IF NOT EXISTS idx_discount_rules_active  ON company_discount_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_policy_installments_policy  ON policy_installments(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_installments_due     ON policy_installments(due_date);
CREATE INDEX IF NOT EXISTS idx_policy_installments_status  ON policy_installments(status);

CREATE INDEX IF NOT EXISTS idx_policy_claims_policy   ON policy_claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_claims_status   ON policy_claims(status);
CREATE INDEX IF NOT EXISTS idx_policy_claims_date     ON policy_claims(incident_date);
CREATE INDEX IF NOT EXISTS idx_policy_claims_number   ON policy_claims(claim_number);

CREATE INDEX IF NOT EXISTS idx_customer_vehicles_customer ON customer_vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_vehicle  ON customer_vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_customer_drivers_customer  ON customer_drivers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_drivers_driver    ON customer_drivers(driver_id);
CREATE INDEX IF NOT EXISTS idx_agent_customers_agent      ON agent_customers(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_customers_customer   ON agent_customers(customer_id);

CREATE INDEX IF NOT EXISTS idx_agent_performance_agent ON agent_performance(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_period ON agent_performance(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_cust_comm_customer ON customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_cust_comm_agent    ON customer_communications(agent_id);
CREATE INDEX IF NOT EXISTS idx_cust_comm_type     ON customer_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_cust_comm_created  ON customer_communications(created_at);

CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON loyalty_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_type     ON loyalty_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_date     ON loyalty_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_payments_entity  ON payment_transactions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_payments_status  ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payments_date    ON payment_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_syslogs_level    ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_syslogs_module   ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_syslogs_user     ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_syslogs_date     ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_syslogs_entity   ON system_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_files_entity   ON file_attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_files_type     ON file_attachments(upload_type);
CREATE INDEX IF NOT EXISTS idx_files_uploader ON file_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_date     ON file_attachments(created_at);

CREATE INDEX IF NOT EXISTS idx_api_logs_integration ON api_integration_logs(integration_name);
CREATE INDEX IF NOT EXISTS idx_api_logs_success     ON api_integration_logs(success);
CREATE INDEX IF NOT EXISTS idx_api_logs_date        ON api_integration_logs(created_at);

-- Triggers for new tables
CREATE TRIGGER trg_company_quotes_upd   BEFORE UPDATE ON company_quotes        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_coverage_templates_upd BEFORE UPDATE ON coverage_templates  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_company_ratings_upd  BEFORE UPDATE ON company_ratings       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_quote_comparisons_upd BEFORE UPDATE ON quote_comparisons    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_discount_rules_upd   BEFORE UPDATE ON company_discount_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_customer_vehicles_upd BEFORE UPDATE ON customer_vehicles    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_customer_drivers_upd BEFORE UPDATE ON customer_drivers      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_agent_customers_upd  BEFORE UPDATE ON agent_customers       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_installments_upd     BEFORE UPDATE ON policy_installments   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payments_upd         BEFORE UPDATE ON payment_transactions  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_commission_rules_upd BEFORE UPDATE ON commission_rules      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_claims_upd           BEFORE UPDATE ON policy_claims         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_renewals_upd         BEFORE UPDATE ON policy_renewals       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_comms_upd            BEFORE UPDATE ON customer_communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_pricing_rules_upd    BEFORE UPDATE ON pricing_rules         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_campaigns_upd        BEFORE UPDATE ON campaigns             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_files_upd            BEFORE UPDATE ON file_attachments      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_cvh_upd              BEFORE UPDATE ON customer_vehicle_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS enable (new tables)
ALTER TABLE company_quotes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_templates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_ratings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_comparisons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_discount_rules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vehicles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_drivers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_installments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_claims            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_history            ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_renewals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_communications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules            ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns                ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_usage           ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vehicle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance        ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integration_logs     ENABLE ROW LEVEL SECURITY;

-- Policies (özet; ihtiyaca göre genişlet)
CREATE POLICY "view_company_quotes"   ON company_quotes         FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_company_quotes" ON company_quotes         FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_coverage_templates" ON coverage_templates   FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "view_company_ratings" ON company_ratings        FOR SELECT TO authenticated USING (true);
CREATE POLICY "create_company_ratings" ON company_ratings      FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_quote_comparisons" ON quote_comparisons    FOR SELECT TO authenticated USING (true);
CREATE POLICY "create_quote_comparisons" ON quote_comparisons  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_discount_rules" ON company_discount_rules  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "view_customer_vehicles" ON customer_vehicles    FOR SELECT TO authenticated USING (true);
CREATE POLICY "view_customer_drivers"  ON customer_drivers     FOR SELECT TO authenticated USING (true);
CREATE POLICY "view_agent_customers"   ON agent_customers      FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_policy_installments" ON policy_installments FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_policy_installments" ON policy_installments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_payment_transactions" ON payment_transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_commission_rules" ON commission_rules      FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_loyalty_transactions" ON loyalty_transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_policy_claims" ON policy_claims            FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_policy_claims" ON policy_claims          FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_quote_history" ON quote_history            FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_customer_comms" ON customer_communications FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_customer_comms" ON customer_communications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_risk_assessments" ON risk_assessments      FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_pricing_rules" ON pricing_rules            FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "view_campaigns" ON campaigns                    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "view_file_attachments" ON file_attachments      FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_file_attachments" ON file_attachments    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "view_report_templates" ON report_templates      FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "view_generated_reports" ON generated_reports    FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_agent_performance" ON agent_performance    FOR SELECT TO authenticated USING (true);

CREATE POLICY "view_system_logs" ON system_logs                FOR SELECT TO authenticated USING (true);
