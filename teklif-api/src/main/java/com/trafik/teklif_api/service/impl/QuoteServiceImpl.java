package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;

    @Autowired
    public QuoteServiceImpl(QuoteRepository quoteRepo) {
        this.quoteRepo = quoteRepo;
    }

    @Override
    public QuoteResponse create(CreateQuoteRequest request) {
        Quote quote = new Quote();
        quote.setCustomerId(request.customerId());
        quote.setRiskScore(request.riskScore());
        quote.setPremiumAmount(BigDecimal.valueOf(request.premiumAmount()));
        quote.setStatus(QuoteStatus.PENDING);
        quote.setUniqueRefNo(UUID.randomUUID().toString());
        quote.setCreatedAt(LocalDateTime.now());
        Vehicle v = new Vehicle();
        v.setPlateNumber(request.vehicle().plateNumber());
        v.setBrand(request.vehicle().brand());
        v.setModel(request.vehicle().model());
        v.setYear(request.vehicle().year());
        quote.setVehicle(v);
        Driver d = new Driver();
        d.setFirstName(request.driver().firstName());
        d.setLastName(request.driver().lastName());
        d.setTcNumber(request.driver().tcNumber());
        d.setBirthDate(request.driver().birthDate());
        quote.setDriver(d);
        Quote saved = quoteRepo.save(quote);
        return mapToResponse(saved);
    }

    @Override
    public List<QuoteResponse> getAll(int page, int size) {
        Page<Quote> p = quoteRepo.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return p.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<QuoteResponse> getRecent() {
        return quoteRepo.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private QuoteResponse mapToResponse(Quote q) {
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
