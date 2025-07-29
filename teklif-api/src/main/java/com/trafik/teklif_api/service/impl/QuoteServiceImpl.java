// Dosya: src/main/java/com/trafik/teklif_api/service/impl/QuoteServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.QuoteService;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;

    public QuoteServiceImpl(QuoteRepository quoteRepo) {
        this.quoteRepo = quoteRepo;
    }

    @Override
    public QuoteResponse create(CreateQuoteRequest req) {
        // Varsayılan değerler
        int risk = req.riskScore() != null ? req.riskScore() : 0;
        BigDecimal premium = req.premiumAmount() != null
            ? BigDecimal.valueOf(req.premiumAmount())
            : BigDecimal.ZERO;

        // Referans ve zaman
        String ref = "Q-" + System.currentTimeMillis();
        LocalDateTime now = LocalDateTime.now();

        // Entity oluştur ve kaydet
        Quote q = new Quote();
        q.setCustomerId(req.customerId());
        q.setRiskScore(risk);
        q.setPremiumAmount(premium);
        q.setStatus(QuoteStatus.PENDING);
        q.setUniqueRefNo(ref);
        q.setCreatedAt(now);

        Quote saved = quoteRepo.save(q);
        return toDto(saved);
    }

    @Override
    public List<QuoteResponse> getAll(int page, int size) {
        return quoteRepo.findAll(
                    PageRequest.of(page, size, Sort.by("createdAt").descending())
               ).stream()
               .map(this::toDto)
               .collect(Collectors.toList());
    }

    @Override
    public List<QuoteResponse> getRecent() {
        // Eğer repository'de özel bir method yoksa paging ile alabilirsiniz:
        return quoteRepo.findAll(
                    PageRequest.of(0, 5, Sort.by("createdAt").descending())
               ).stream()
               .map(this::toDto)
               .collect(Collectors.toList());
    }

    private QuoteResponse toDto(Quote q) {
        return new QuoteResponse(
            q.getId(),
            q.getCustomerId(),
            q.getRiskScore(),
            q.getPremiumAmount(),
            q.getStatus(),
            q.getUniqueRefNo(),
            q.getCreatedAt()
        );
    }
}
