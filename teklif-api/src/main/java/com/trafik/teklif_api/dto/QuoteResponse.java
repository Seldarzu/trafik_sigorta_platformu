package com.trafik.teklif_api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuoteResponse(
    Long id,
    Long customerId,
    Integer riskScore,
    BigDecimal premiumAmount,
    String status,
    String uniqueRefNo,
    LocalDateTime createdAt
) {}
