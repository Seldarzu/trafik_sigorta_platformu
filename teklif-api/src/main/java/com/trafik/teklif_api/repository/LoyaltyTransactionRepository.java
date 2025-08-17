package com.trafik.teklif_api.repository;
import com.trafik.teklif_api.entity.LoyaltyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, java.util.UUID> {}
