package com.trafik.teklif_api.dto;

public record MonthlyDto(
    String month,
    double revenue, 
    long policies,
    long quotes
) {}
