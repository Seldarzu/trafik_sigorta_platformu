// src/main/java/com/trafik/teklif_api/repository/InsuranceCompanyRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.InsuranceCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InsuranceCompanyRepository extends JpaRepository<InsuranceCompany, UUID> {

    // /api/quotes/{id}/company-offers için gerekiyor
    List<InsuranceCompany> findByIsActiveTrue();

    // İleride işine yarayabilir (opsiyonel)
    Optional<InsuranceCompany> findByCode(String code);
    boolean existsByCode(String code);
}
