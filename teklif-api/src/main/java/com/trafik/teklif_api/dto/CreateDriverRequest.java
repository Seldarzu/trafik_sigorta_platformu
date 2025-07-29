package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateDriverRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    String licenseNumber
) {}
