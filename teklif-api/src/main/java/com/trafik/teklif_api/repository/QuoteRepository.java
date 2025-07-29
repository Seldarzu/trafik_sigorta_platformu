// src/main/java/com/trafik/teklif_api/repository/QuoteRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    /** Statüye göre teklif sayısı */
    long countByStatus(QuoteStatus status);

    /** Bir müşteriye ait tüm teklifleri getirir */
    List<Quote> findByCustomerId(Long customerId);

    /** Belirli bir tarihten sonra oluşturulmuş teklifleri getirir */
    List<Quote> findByCreatedAtAfter(LocalDateTime since);
}
