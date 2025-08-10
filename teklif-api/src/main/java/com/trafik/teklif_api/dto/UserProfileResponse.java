package com.trafik.teklif_api.dto;

import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String firstName,
    String lastName,
    String email
) {}
