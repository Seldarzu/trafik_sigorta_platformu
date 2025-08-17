package com.trafik.teklif_api.dto.system;

import java.time.LocalDate;

public record SystemConfigResponse(
    String agencyName,
    String agencyCode,
    String licenseNumber,
    LocalDate joinDate,
    LocalDate lastLogin,
    Boolean isActive
) {}
