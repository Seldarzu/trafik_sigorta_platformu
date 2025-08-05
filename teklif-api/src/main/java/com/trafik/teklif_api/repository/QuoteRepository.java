// src/main/java/com/trafik/teklif_api/repository/QuoteRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuoteRepository
    extends JpaRepository<Quote, UUID>,
            JpaSpecificationExecutor<Quote> {

    Optional<Quote> findByUniqueRefNo(String uniqueRefNo);

    List<Quote> findTop10ByOrderByCreatedAtDesc();

    List<Quote> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
}
