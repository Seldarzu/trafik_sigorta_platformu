package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.model.Quote;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Teklif (Quote) iş mantığını barındıran servis katmanı.
 * - CreateQuoteRequest DTO'sunu alır, iş kurallarını uygular,
 *   Quote entity'sini kaydeder ve QuoteResponse DTO'sunu döner.
 * - Tüm teklifleri listeler.
 */
@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final CustomerRepository customerRepository;

    public QuoteService(QuoteRepository quoteRepository,
                        CustomerRepository customerRepository) {
        this.quoteRepository = quoteRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Yeni bir teklif oluşturur.
     * @param req CreateQuoteRequest DTO
     * @return Oluşturulan teklifin QuoteResponse DTO'su
     */
    @Transactional
    public QuoteResponse createQuote(CreateQuoteRequest req) {
        // 1) İlgili müşteriyi bul
        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + req.getCustomerId()));

        // 2) Risk ve prim hesaplama (placeholder mantık)
        int riskScore = (req.getRiskScore() != null)
                ? req.getRiskScore()
                : calculateRisk(customer);
        BigDecimal premium = (req.getPremiumAmount() != null)
                ? BigDecimal.valueOf(req.getPremiumAmount())
                : calculatePremium(riskScore);

        // 3) Entity oluşturup set et
        Quote quote = new Quote();
        quote.setCustomer(customer);
        quote.setRiskScore(riskScore);
        quote.setPremiumAmount(premium);
        quote.setStatus("PENDING");
        quote.setUniqueRefNo(generateRef());
        quote.setCreatedAt(LocalDateTime.now());

        // 4) Veritabanına kaydet
        Quote saved = quoteRepository.save(quote);

        // 5) Kaydedilen entity'yi DTO'ya dönüştür ve dön
        return mapToDto(saved);
    }

    /**
     * Tüm teklifleri listeler.
     * @return QuoteResponse DTO listesİ
     */
    @Transactional(readOnly = true)
    public List<QuoteResponse> listAll() {
        return quoteRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // —————— Yardımcı metotlar ——————

    /** Basit placeholder risk hesaplama */
    private int calculateRisk(Customer customer) {
        // Örneğin sabit 50; gerçek mantık yaş, kasko vs. eklenebilir
        return 50;
    }

    /** Basit placeholder prim hesaplama */
    private BigDecimal calculatePremium(int riskScore) {
        // Örnek formül: riskScore * 10 TL
        return BigDecimal.valueOf(riskScore).multiply(BigDecimal.TEN);
    }

    /** Entity’den Response DTO’ya dönüştürme */
    private QuoteResponse mapToDto(Quote q) {
        QuoteResponse dto = new QuoteResponse();
        dto.setId(q.getId());
        dto.setCustomerId(q.getCustomer().getId());
        dto.setRiskScore(q.getRiskScore());
        dto.setPremiumAmount(q.getPremiumAmount());
        dto.setStatus(q.getStatus());
        dto.setUniqueRefNo(q.getUniqueRefNo());
        dto.setCreatedAt(q.getCreatedAt());
        return dto;
    }

    /** Tekrarsız referans numarası üretme (timestamp tabanlı) */
    private String generateRef() {
        return "TQ" + System.currentTimeMillis();
    }
}
