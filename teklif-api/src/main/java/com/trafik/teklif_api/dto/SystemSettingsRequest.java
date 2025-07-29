package com.trafik.teklif_api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SystemSettingsRequest(
    @NotBlank String agencyName,
    @NotBlank String agencyCode,
    @NotBlank String licenseNumber,
    @NotNull LocalDate joinDate,
    @NotNull LocalDate lastLogin,
    @NotNull Boolean isActive
) {}
