package com.trafik.teklif_api.dto;

public record AnalyticsResponse(
    long totalCustomers,
    long totalQuotes,
    long pendingQuotes,
    long approvedQuotes
) {}
