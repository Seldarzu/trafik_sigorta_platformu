package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateCustomerRequest(
    @NotBlank @Size(min = 11, max = 11) String tcNo,
    @NotBlank String name,
    @Past LocalDate birthDate,
    String phone
) {}
