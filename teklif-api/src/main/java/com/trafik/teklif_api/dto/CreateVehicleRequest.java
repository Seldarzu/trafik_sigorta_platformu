// src/main/java/com/trafik/teklif_api/dto/CreateVehicleRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.*;

public record CreateVehicleRequest(
    @NotBlank @Size(max = 20) String plateNumber,
    String brand,
    String model,
    @NotNull @Min(1900) @Max(2100) Integer year,
    String engineSize,
    String fuelType,
    String usage,
    String cityCode
) {}
