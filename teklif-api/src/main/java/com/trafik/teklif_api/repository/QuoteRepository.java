package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository
        extends JpaRepository<Quote, String>,
                JpaSpecificationExecutor<Quote> {

    List<Quote> findTop10ByOrderByCreatedAtDesc();
    List<Quote> findByCustomerIdOrderByCreatedAtDesc(java.util.UUID customerId);
}
