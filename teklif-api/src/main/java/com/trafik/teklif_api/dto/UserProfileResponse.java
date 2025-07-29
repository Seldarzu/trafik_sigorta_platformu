package com.trafik.teklif_api.dto;

public record UserProfileResponse(
    Long id,
    String firstName,
    String lastName,
    String email
) {}
