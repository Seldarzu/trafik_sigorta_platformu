// src/main/java/com/trafik/teklif_api/dto/CustomerRequest.java
package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.entity.Status;
import com.trafik.teklif_api.entity.RiskProfile;
import com.trafik.teklif_api.entity.CustomerValue;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CustomerRequest(
    @NotBlank @Pattern(regexp="\\d{11}") String tcNumber,
    @NotBlank String firstName,
    @NotBlank String lastName,
    @Past LocalDate birthDate,
    @Pattern(regexp="^\\+?[0-9]*$") String phone,
    @Email String email,
    String address,
    String city,
    @NotNull Status status,
    @NotNull RiskProfile riskProfile,
    @NotNull CustomerValue customerValue,
    String notes
) {}
