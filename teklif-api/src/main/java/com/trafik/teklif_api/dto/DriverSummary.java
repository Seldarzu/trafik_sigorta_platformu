package com.trafik.teklif_api.dto;

public record DriverSummary(
    String firstName,
    String lastName,
    String profession,
    Boolean hasAccidents,
    Boolean hasViolations
) {}
