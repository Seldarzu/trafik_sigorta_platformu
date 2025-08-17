-- Materialized Views
CREATE MATERIALIZED VIEW IF NOT EXISTS customer_summary AS
SELECT 
  c.id, c.first_name, c.last_name, c.email, c.phone, c.status, c.customer_value,
  c.total_policies, c.total_premium,
  COUNT(DISTINCT cv.vehicle_id) AS vehicle_count,
  COUNT(DISTINCT cd.driver_id)  AS driver_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') AS active_policy_count,
  COALESCE(SUM(pi.amount),0) AS pending_installments,
  COUNT(DISTINCT pc.id) AS claim_count,
  c.loyalty_points + COALESCE(SUM(lt.points),0) AS total_loyalty_points
FROM customers c
LEFT JOIN customer_vehicles cv ON c.id = cv.customer_id
LEFT JOIN customer_drivers  cd ON c.id = cd.customer_id
LEFT JOIN policies p ON c.id = p.customer_id
LEFT JOIN policy_installments pi ON p.id = pi.policy_id AND pi.status = 'pending'
LEFT JOIN policy_claims pc ON p.id = pc.policy_id
LEFT JOIN loyalty_transactions lt ON c.id = lt.customer_id AND lt.transaction_type = 'earned'
GROUP BY c.id, c.first_name, c.last_name, c.email, c.phone, c.status, c.customer_value, c.total_policies, c.total_premium, c.loyalty_points;

CREATE MATERIALIZED VIEW IF NOT EXISTS agent_performance_summary AS
SELECT 
  u.id AS agent_id, u.first_name, u.last_name,
  COUNT(DISTINCT ac.customer_id) AS total_customers,
  COUNT(DISTINCT q.id) AS total_quotes,
  COUNT(DISTINCT p.id) AS total_policies,
  COALESCE(SUM(p.final_premium),0) AS total_premium_sold,
  COALESCE(AVG(p.final_premium),0) AS average_premium,
  COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'sold') AS converted_quotes,
  CASE WHEN COUNT(DISTINCT q.id) > 0
       THEN ROUND((COUNT(DISTINCT q.id) FILTER (WHERE q.status='sold')::DECIMAL / COUNT(DISTINCT q.id)) * 100, 2)
       ELSE 0 END AS conversion_rate
FROM users u
LEFT JOIN agent_customers ac ON u.id = ac.agent_id
LEFT JOIN quotes q ON u.id = q.agent_id
LEFT JOIN policies p ON u.id = p.agent_id
WHERE u.role = 'agent' AND u.is_active = true
GROUP BY u.id, u.first_name, u.last_name;

-- Functions
CREATE OR REPLACE FUNCTION calculate_customer_segment(customer_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  customer_record customers%ROWTYPE;
  loyalty_months INTEGER;
  segment VARCHAR(20);
BEGIN
  SELECT * INTO customer_record FROM customers WHERE id = customer_id;
  loyalty_months := EXTRACT(MONTH FROM AGE(CURRENT_DATE, customer_record.registration_date::DATE));
  IF customer_record.total_premium >= 15000 AND customer_record.total_policies >= 3 AND loyalty_months >= 24 AND customer_record.average_claim_frequency <= 0.2 THEN
    segment := 'platinum';
  ELSIF customer_record.total_premium >= 8000 AND customer_record.total_policies >= 2 AND loyalty_months >= 12 AND customer_record.average_claim_frequency <= 0.3 THEN
    segment := 'gold';
  ELSIF customer_record.total_premium >= 3000 AND customer_record.total_policies >= 1 AND loyalty_months >= 6 AND customer_record.average_claim_frequency <= 0.5 THEN
    segment := 'silver';
  ELSE
    segment := 'bronze';
  END IF;
  UPDATE customers SET customer_value = segment WHERE id = customer_id;
  RETURN segment;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_risk_score(driver_data JSONB, vehicle_data JSONB)
RETURNS INTEGER AS $$
DECLARE
  risk_score INTEGER := 50;
  driver_age INTEGER;
  vehicle_age INTEGER;
BEGIN
  driver_age := EXTRACT(YEAR FROM AGE(CURRENT_DATE, (driver_data->>'birthDate')::DATE));
  vehicle_age := EXTRACT(YEAR FROM CURRENT_DATE) - (vehicle_data->>'year')::INTEGER;

  IF driver_age < 25 THEN risk_score := risk_score + 25;
  ELSIF driver_age > 65 THEN risk_score := risk_score + 15;
  ELSIF driver_age BETWEEN 30 AND 50 THEN risk_score := risk_score - 5;
  END IF;

  IF COALESCE((driver_data->>'hasAccidents')::BOOLEAN,false) THEN
    risk_score := risk_score + COALESCE((driver_data->>'accidentCount')::INTEGER,0) * 20;
  END IF;

  IF COALESCE((driver_data->>'hasViolations')::BOOLEAN,false) THEN
    risk_score := risk_score + COALESCE((driver_data->>'violationCount')::INTEGER,0) * 10;
  END IF;

  IF vehicle_age <= 3 THEN risk_score := risk_score - 5;
  ELSIF vehicle_age > 15 THEN risk_score := risk_score + 20;
  END IF;

  RETURN GREATEST(0, LEAST(100, risk_score));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_company_score(
  p_company_id UUID,
  p_final_premium DECIMAL,
  p_coverage_amount INTEGER,
  p_risk_score INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  price_score DECIMAL;
  coverage_score DECIMAL;
  service_score DECIMAL;
  total_score DECIMAL;
  company_rating DECIMAL;
BEGIN
  SELECT rating INTO company_rating FROM insurance_companies WHERE id = p_company_id;

  price_score   := GREATEST(0, (5000 - p_final_premium) / 5000 * 40);
  coverage_score:= LEAST(40, p_coverage_amount / 1000000 * 40);
  service_score := (COALESCE(company_rating,0) / 5) * 25;

  total_score := price_score + coverage_score + service_score;
  RETURN ROUND(total_score, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_applicable_discounts(
  p_company_id UUID,
  p_driver_data JSONB,
  p_vehicle_data JSONB,
  p_base_premium DECIMAL
) RETURNS TABLE(
  discount_type VARCHAR,
  discount_name VARCHAR,
  discount_percentage DECIMAL,
  discount_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cdr.discount_type,
    cdr.discount_name,
    cdr.discount_percentage,
    ROUND(p_base_premium * cdr.discount_percentage / 100, 2) as discount_amount
  FROM company_discount_rules cdr
  WHERE cdr.company_id = p_company_id 
    AND cdr.is_active = true
    AND (cdr.valid_until IS NULL OR cdr.valid_until > NOW())
    AND (
      (cdr.discount_type = 'safe_driver' AND 
       COALESCE((p_driver_data->>'hasAccidents')::BOOLEAN,false) = false AND
       COALESCE((p_driver_data->>'hasViolations')::BOOLEAN,false) = false) OR
      (cdr.discount_type = 'young_driver' AND
       EXTRACT(YEAR FROM AGE(CURRENT_DATE, (p_driver_data->>'birthDate')::DATE)) BETWEEN 18 AND 25) OR
      cdr.discount_type NOT IN ('safe_driver','young_driver')
    );
END;
$$ LANGUAGE plpgsql;
