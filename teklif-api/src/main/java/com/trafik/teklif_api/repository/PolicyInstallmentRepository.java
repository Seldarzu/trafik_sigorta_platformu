package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.PolicyInstallment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyInstallmentRepository extends JpaRepository<PolicyInstallment, UUID> {
    List<PolicyInstallment> findByPolicy_Id(UUID policyId);
}
