package com.trafik.teklif_api.dto;

import java.util.UUID;
import java.time.LocalDate;

public record DriverResponse(
    UUID id,
    String firstName,
    String lastName,
    String tcNumber,
    LocalDate birthDate,
    LocalDate licenseDate,
    String gender,
    String maritalStatus,
    String education,
    String profession,
    Boolean hasAccidents,
    Integer accidentCount,
    Boolean hasViolations,
    Integer violationCount
) {}
