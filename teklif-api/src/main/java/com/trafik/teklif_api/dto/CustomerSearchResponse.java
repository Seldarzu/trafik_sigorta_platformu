// src/main/java/com/trafik/teklif_api/dto/CustomerSearchResponse.java
package com.trafik.teklif_api.dto;

import java.util.UUID;

/**
 * Küçük müşteri arama sonucu DTO’su
 */
public record CustomerSearchResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String phone
) {}
