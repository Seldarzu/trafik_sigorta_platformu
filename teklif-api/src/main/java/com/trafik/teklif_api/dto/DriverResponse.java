package com.trafik.teklif_api.dto;

public record DriverResponse(
    Long id,
    String firstName,
    String lastName,
    String licenseNumber
) {}
