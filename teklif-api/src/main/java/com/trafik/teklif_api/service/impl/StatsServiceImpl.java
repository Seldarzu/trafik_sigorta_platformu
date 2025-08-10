package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.stats.ConversionResponse;
import com.trafik.teklif_api.dto.stats.CountResponse;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final QuoteRepository quoteRepo;
    private final PolicyRepository policyRepo;
    private final CustomerRepository customerRepo;

    @Override
    public CountResponse quotes() {
        long count = quoteRepo.count();
        return new CountResponse(count);
    }

    @Override
    public CountResponse policies() {
        long count = policyRepo.count();
        return new CountResponse(count);
    }

    @Override
    public CountResponse customers() {
        long count = customerRepo.count();
        return new CountResponse(count);
    }

    @Override
    public ConversionResponse conversion() {
        List<Quote> all = quoteRepo.findAll();
        long total = all.size();
        long approved = all.stream().filter(q -> q.getStatus() == QuoteStatus.APPROVED).count();
        double rate = total > 0 ? (approved * 100.0) / total : 0.0;
        return new ConversionResponse(total, approved, rate);
    }
}
