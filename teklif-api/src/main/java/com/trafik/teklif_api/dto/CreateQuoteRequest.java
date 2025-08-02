package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotNull;

public record CreateQuoteRequest(
    @NotNull Long customerId,
    @NotNull Integer riskScore,
    @NotNull Double premiumAmount,
    @NotNull CreateVehicleRequest vehicle,
    @NotNull CreateDriverRequest driver
) {}
