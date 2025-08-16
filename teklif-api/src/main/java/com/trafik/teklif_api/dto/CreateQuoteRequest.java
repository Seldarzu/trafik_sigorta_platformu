// src/main/java/com/trafik/teklif_api/dto/CreateQuoteRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateQuoteRequest(
    @NotNull UUID customerId,
    @NotNull UUID vehicleId,
    @NotNull UUID driverId,
    @NotNull UUID agentId,
    Integer riskScore,
    Double premiumAmount,
    Double coverageAmount
) {}
