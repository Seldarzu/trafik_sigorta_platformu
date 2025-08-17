package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.model.enums.QuoteStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Birleştirilmiş QuoteResponse
 * - id, customer/vehicle/driver/agent
 * - riskScore, riskLevel, status
 * - premium, coverageAmount, finalPremium, totalDiscount
 * - validUntil, createdAt
 * - vehicle & driver özetleri
 * - companyName (seçili şirketin adı – gösterim amaçlı)
 */
public record QuoteResponse(
        String id,
        UUID customerId,
        UUID vehicleId,
        UUID driverId,
        UUID agentId,

        Integer riskScore,
        String riskLevel,
        QuoteStatus status,

        BigDecimal premium,
        BigDecimal coverageAmount,
        BigDecimal finalPremium,
        BigDecimal totalDiscount,

        OffsetDateTime validUntil,
        OffsetDateTime createdAt,

        VehicleSummary vehicle,
        DriverSummary driver,

        // <<< service.map(...) ile gönderdiğin alan
        String companyName
) {}
