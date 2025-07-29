package com.trafik.teklif_api.dto;

public record VehicleResponse(
    Long id,
    String plateNumber,
    String brand,
    String model,
    Integer year
) {}
