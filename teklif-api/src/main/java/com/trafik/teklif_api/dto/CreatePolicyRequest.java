// CreatePolicyRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CreatePolicyRequest(
    @NotNull UUID customerId,
    @NotNull String quoteId,
    @NotNull UUID vehicleId,
    @NotNull UUID driverId,
    @NotNull LocalDateTime startDate,
    @NotNull LocalDateTime endDate,
    UUID agentId,
    UUID companyId,
    @NotNull @DecimalMin("0.0") BigDecimal premium,
    @NotNull @DecimalMin("0.0") BigDecimal finalPremium,
    @NotNull @DecimalMin("0.0") BigDecimal coverageAmount,
    @NotNull Boolean isAutoRenewal,
    LocalDateTime renewalDate,
    Integer riskScore,
    String riskLevel,
    BigDecimal totalDiscount,
    String policyData
) {}
