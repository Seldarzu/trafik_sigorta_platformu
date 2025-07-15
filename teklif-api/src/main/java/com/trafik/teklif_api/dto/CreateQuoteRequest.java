package com.trafik.teklif_api.dto;

public record CreateQuoteRequest(
    Long customerId,
    Integer riskScore,
    Double premiumAmount
) {}
