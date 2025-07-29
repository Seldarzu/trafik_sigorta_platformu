package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.QuoteStatus;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public record QuoteResponse(
    Long id,
    Long customerId,
    Integer riskScore,
    BigDecimal premiumAmount,       // BigDecimal olarak düzelttik
    QuoteStatus status,
    String uniqueRefNo,
    LocalDateTime createdAt
) {}
