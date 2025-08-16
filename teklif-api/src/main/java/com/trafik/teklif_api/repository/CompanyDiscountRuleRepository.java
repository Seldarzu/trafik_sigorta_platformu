
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.CompanyDiscountRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CompanyDiscountRuleRepository extends JpaRepository<CompanyDiscountRule, UUID> {
  List<CompanyDiscountRule> findByCompanyIdAndIsActive(UUID companyId, boolean isActive);
  List<CompanyDiscountRule> findByCompanyId(UUID companyId);
}
