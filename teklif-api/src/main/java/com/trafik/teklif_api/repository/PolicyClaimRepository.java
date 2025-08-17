package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.PolicyClaim;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyClaimRepository extends JpaRepository<PolicyClaim, UUID> {
    List<PolicyClaim> findByPolicy_Id(UUID policyId);
}
