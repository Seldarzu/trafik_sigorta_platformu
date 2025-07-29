package com.trafik.teklif_api.dto;

public record RiskDto(
    String level,
    long count,
    double percentage,
    String color
) {}