// src/main/java/com/trafik/teklif_api/dto/VehicleResponse.java
package com.trafik.teklif_api.dto;

public record VehicleResponse(
    Long id,
    String plateNumber,
    String brand,
    String model,
    Integer year,
    String engineSize,
    String fuelType,
    String usage,
    String cityCode
) {}
