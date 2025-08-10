package com.trafik.teklif_api.dto;

public record VehicleSummary(
    String brand,
    String model,
    Integer year,
    String plateNumber
) {}
