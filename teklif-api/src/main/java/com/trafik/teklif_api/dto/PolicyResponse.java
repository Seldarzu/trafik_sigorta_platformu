// src/main/java/com/trafik/teklif_api/dto/PolicyResponse.java
package com.trafik.teklif_api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PolicyResponse DTO — poliçe CRUD, yenileme, listeleme, arama vb.
 * işlemlerinden döndürülecek temel poliçe bilgilerini taşır.
 */
public record PolicyResponse(
    java.util.UUID   id,
    String           quoteId,       // artık String
    java.util.UUID   customerId,
    String           policyNumber,
    BigDecimal       finalPremium,
    LocalDateTime    startDate,
    LocalDateTime    endDate,
    com.trafik.teklif_api.model.PolicyStatus status,
    LocalDateTime    createdAt
) {}

