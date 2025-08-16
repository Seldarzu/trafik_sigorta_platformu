// src/main/java/com/trafik/teklif_api/repository/CoverageTemplateRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.CoverageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CoverageTemplateRepository extends JpaRepository<CoverageTemplate, UUID> {
  List<CoverageTemplate> findByCompanyIdAndIsActive(UUID companyId, boolean isActive);
  List<CoverageTemplate> findByCompanyId(UUID companyId);
}
