package com.trafik.teklif_api.dto;

import java.util.UUID;

public record VehicleResponse(
    UUID id,
    String plateNumber,
    String brand,
    String model,
    Integer year,
    String engineSize,
    String fuelType, // enum adı (String)
    String usage,    // enum adı (String)
    String cityCode
) {}
