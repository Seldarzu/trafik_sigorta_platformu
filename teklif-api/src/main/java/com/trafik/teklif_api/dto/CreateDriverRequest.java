// src/main/java/com/trafik/teklif_api/dto/CreateDriverRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateDriverRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotBlank @Pattern(regexp = "\\d{11}") String tcNumber,
    @NotNull @Past LocalDate birthDate,
    LocalDate licenseDate,
    String gender,
    String maritalStatus,
    String education,
    String profession,
    @NotNull Boolean hasAccidents,
    @Min(0) Integer accidentCount,
    @NotNull Boolean hasViolations,
    @Min(0) Integer violationCount
) {}
