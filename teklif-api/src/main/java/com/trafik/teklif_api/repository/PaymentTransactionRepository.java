package com.trafik.teklif_api.repository;
import com.trafik.teklif_api.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, java.util.UUID> {}
