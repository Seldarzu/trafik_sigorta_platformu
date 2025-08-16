package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID>, JpaSpecificationExecutor<Policy> {
    List<Policy> findByEndDateBetween(LocalDate from, LocalDate to); // <— LocalDate
    List<Policy> findByCustomerIdOrderByEndDateDesc(UUID customerId);
}
