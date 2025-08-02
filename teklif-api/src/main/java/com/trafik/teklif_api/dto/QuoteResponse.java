package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.QuoteStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuoteResponse(
    Long id,
    Long customerId,
    Integer riskScore,
    BigDecimal premiumAmount,
    QuoteStatus status,
    String uniqueRefNo,
    LocalDateTime createdAt
) {}
