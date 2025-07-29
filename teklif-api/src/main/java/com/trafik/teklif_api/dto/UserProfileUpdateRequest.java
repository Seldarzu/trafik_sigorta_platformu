package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record UserProfileUpdateRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotBlank @Email String email
) {}
