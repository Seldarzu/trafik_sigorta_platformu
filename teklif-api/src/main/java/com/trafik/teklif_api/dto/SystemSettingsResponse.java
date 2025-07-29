package com.trafik.teklif_api.dto;

import java.time.LocalDate;

public record SystemSettingsResponse(
    String agencyName,
    String agencyCode,
    String licenseNumber,
    LocalDate joinDate,
    LocalDate lastLogin,
    Boolean isActive
) {}
