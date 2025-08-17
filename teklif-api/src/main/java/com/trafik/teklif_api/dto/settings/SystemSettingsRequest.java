package com.trafik.teklif_api.dto.settings;

import java.time.LocalDate;
import java.util.Map;

/**
 * Birleştirilmiş SystemSettingsRequest
 * - İlk sürümden: values (anahtar-değer şeklinde esnek ayar listesi)
 * - İkinci sürümden: agencyName, agencyCode, licenseNumber, joinDate, lastLogin, isActive
 *
 * Null gelen alanlar güncellenmez (patch/upsert mantığı).
 */
public record SystemSettingsRequest(
        Map<String, Object> values,
        String agencyName,
        String agencyCode,
        String licenseNumber,
        LocalDate joinDate,
        LocalDate lastLogin,
        Boolean isActive
) {}
