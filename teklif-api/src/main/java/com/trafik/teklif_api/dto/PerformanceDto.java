package com.trafik.teklif_api.dto;

public record PerformanceDto(
    String metric,
    double current,
    double previous,
    double target,
    String unit
) {}