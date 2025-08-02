package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    Optional<Quote> findByUniqueRefNo(String uniqueRefNo);

    // Spring Data JPA zaten şöyle bir metot sağlıyor, extra override ihtiyacı yok:
    // Page<Quote> findAll(Pageable pageable);

    List<Quote> findTop10ByOrderByCreatedAtDesc();
    List<Quote> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
