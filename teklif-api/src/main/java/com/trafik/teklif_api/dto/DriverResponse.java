// src/main/java/com/trafik/teklif_api/dto/DriverResponse.java
package com.trafik.teklif_api.dto;

import java.time.LocalDate;

public record DriverResponse(
    Long id,
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
