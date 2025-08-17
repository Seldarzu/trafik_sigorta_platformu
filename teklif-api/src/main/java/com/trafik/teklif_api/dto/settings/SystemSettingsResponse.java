package com.trafik.teklif_api.dto.settings;

import java.time.LocalDate;
import java.util.Map;

/**
 * Birleştirilmiş SystemSettingsResponse
 * - İlk sürümden: values (anahtar-değer şeklinde esnek ayar listesi)
 * - İkinci sürümden: agencyName, agencyCode, licenseNumber, joinDate, lastLogin, isActive
 */
public record SystemSettingsResponse(
        Map<String, Object> values,
        String agencyName,
        String agencyCode,
        String licenseNumber,
        LocalDate joinDate,
        LocalDate lastLogin,
        Boolean isActive
) {}
