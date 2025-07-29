package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;


public record UpdateVehicleRequest(
    @NotBlank String plateNumber,
    String brand,
    String model,
    @Min(1900) @Max(2100) Integer year
) {}
