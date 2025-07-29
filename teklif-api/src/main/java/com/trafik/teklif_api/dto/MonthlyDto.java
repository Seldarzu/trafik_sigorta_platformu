package com.trafik.teklif_api.dto;

public record MonthlyDto(
    String month,
    long revenue,
    long policies,
    long quotes
) {}
