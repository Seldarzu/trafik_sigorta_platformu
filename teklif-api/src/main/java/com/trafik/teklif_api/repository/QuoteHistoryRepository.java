package com.trafik.teklif_api.repository;
import com.trafik.teklif_api.entity.QuoteHistory;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuoteHistoryRepository extends JpaRepository<QuoteHistory, java.util.UUID> {}
