package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.RiskProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer> {
     long countByRiskProfile(RiskProfile profile);
}
