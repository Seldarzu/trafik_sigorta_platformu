package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.enums.PolicyStatus;
import com.trafik.teklif_api.model.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FE'nin ihtiyaç duyduğu özet alanlar eklendi:
 * - companyName
 * - coverageAmount, totalDiscount
 * - paymentStatus
 * - vehicle, driver özetleri
 */
public record PolicyResponse(
    UUID          id,
    String        quoteId,
    UUID          customerId,
    String        policyNumber,

    BigDecimal    finalPremium,
    BigDecimal    coverageAmount,
    BigDecimal    totalDiscount,

    PolicyStatus  status,
    PaymentStatus paymentStatus,

    LocalDateTime startDate,
    LocalDateTime endDate,
    LocalDateTime createdAt,

    // FE kart & modal için özetler
    VehicleSummary vehicle,
    DriverSummary  driver,
    String         companyName
) {}
