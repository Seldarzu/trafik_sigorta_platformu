// src/main/java/com/trafik/teklif_api/dto/CreateCustomerNoteRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCustomerNoteRequest(
    @NotBlank String note
) {}
