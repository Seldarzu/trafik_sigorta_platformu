// src/main/java/com/trafik/teklif_api/dto/UpdateQuoteRequest.java
package com.trafik.teklif_api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record UpdateQuoteRequest(
    @NotNull UUID customerId,
    @NotNull Integer riskScore,
    @NotNull Double premiumAmount,
    @NotNull CreateVehicleRequest vehicle,
    @NotNull CreateDriverRequest driver
) {}
