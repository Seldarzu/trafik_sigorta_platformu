package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.model.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuoteService {
  private final QuoteRepository quoteRepo;
  private final CustomerRepository custRepo;

  public QuoteService(QuoteRepository quoteRepo, CustomerRepository custRepo) {
    this.quoteRepo = quoteRepo;
    this.custRepo = custRepo;
  }

  public QuoteResponse createQuote(CreateQuoteRequest req) {
    var customer = custRepo.findById(req.customerId())
      .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

    int risk = req.riskScore() != null ? req.riskScore() : 50;
    BigDecimal premium = req.premiumAmount() != null
      ? BigDecimal.valueOf(req.premiumAmount())
      : BigDecimal.valueOf(risk * 10);

    var q = new Quote();
    q.setCustomer(customer);
    q.setRiskScore(risk);
    q.setPremiumAmount(premium);
    q.setStatus(QuoteStatus.PENDING);
    q.setRefNo("Q" + System.currentTimeMillis());
    q.setCreatedAt(LocalDateTime.now());

    var saved = quoteRepo.save(q);
    return new QuoteResponse(
      saved.getId(),
      saved.getCustomer().getId(),
      saved.getRiskScore(),
      saved.getPremiumAmount(),
      saved.getStatus().name(),
      saved.getRefNo(),
      saved.getCreatedAt()
    );
  }

  public List<QuoteResponse> listAll() {
    return quoteRepo.findAll().stream()
      .map(saved -> new QuoteResponse(
        saved.getId(),
        saved.getCustomer().getId(),
        saved.getRiskScore(),
        saved.getPremiumAmount(),
        saved.getStatus().name(),
        saved.getRefNo(),
        saved.getCreatedAt()
      ))
      .collect(Collectors.toList());
  }
}
