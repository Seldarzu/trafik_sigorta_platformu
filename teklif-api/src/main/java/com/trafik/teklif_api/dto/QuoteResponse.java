package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.QuoteStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record QuoteResponse(
    String id,
    UUID customerId,
    Integer riskScore,
    BigDecimal premium,
    BigDecimal coverageAmount,
    BigDecimal finalPremium,
    BigDecimal totalDiscount,
    String riskLevel,
    QuoteStatus status,
    OffsetDateTime validUntil,
    OffsetDateTime createdAt
) {}
