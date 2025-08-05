package com.trafik.teklif_api.dto;

import java.time.LocalDate;

public record LicenseInfoResponse(
    String tcNumber,
    String firstName,
    String lastName,
    LocalDate licenseDate
) {}