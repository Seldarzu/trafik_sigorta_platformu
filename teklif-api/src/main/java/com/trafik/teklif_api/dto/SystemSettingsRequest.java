package com.trafik.teklif_api.dto;

import java.time.LocalDate;

/**
 * Patch/Upsert için: tüm alanlar opsiyonel.
 * Null gelen alanlar güncellenmez.
 */
public record SystemSettingsRequest(
    String agencyName,
    String agencyCode,
    String licenseNumber,
    LocalDate joinDate,
    LocalDate lastLogin,
    Boolean isActive
) {}
