package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.QuoteStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteResponse(
    UUID id,
    UUID customerId,
    Integer riskScore,
    BigDecimal premiumAmount,
    QuoteStatus status,
    String uniqueRefNo,
    LocalDateTime createdAt
) {}
