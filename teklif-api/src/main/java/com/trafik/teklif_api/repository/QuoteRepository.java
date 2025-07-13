package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
}
