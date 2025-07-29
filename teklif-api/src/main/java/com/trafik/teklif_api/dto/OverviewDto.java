// src/main/java/com/trafik/teklif_api/dto/OverviewDto.java
package com.trafik.teklif_api.dto;

/**
 * UI'ın quickStats kısmının ihtiyaç duyduğu dört değeri içerir.
 */
public record OverviewDto(
    double totalRevenue,
    long totalPolicies,
    double conversionRate,
    double averagePremium
) {}
