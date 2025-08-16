package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.*;

public record CreateVehicleRequest(
    @NotBlank @Size(max = 20) String plateNumber,
    @NotBlank @Size(max = 60) String brand,
    @NotBlank @Size(max = 60) String model,
    @NotNull @Min(1900) @Max(2100) Integer year,
    @NotBlank @Size(max = 20) String engineSize,
    @NotBlank String fuelType,   // "GASOLINE", "DIESEL", ...
    @NotBlank String usage,      // "PERSONAL", "COMMERCIAL", ...
    @NotBlank @Size(max = 10) String cityCode
) {}
