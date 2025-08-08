package com.trafik.teklif_api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CreateQuoteRequest(
    @NotNull UUID customerId,
    @NotNull Integer riskScore,
    @NotNull Double premiumAmount,
    @NotNull CreateVehicleRequest vehicle,
    @NotNull CreateDriverRequest driver
) {}

