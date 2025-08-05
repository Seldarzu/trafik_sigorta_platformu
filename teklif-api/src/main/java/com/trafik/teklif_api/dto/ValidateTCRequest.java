// src/main/java/com/trafik/teklif_api/dto/ValidateTCRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ValidateTCRequest(
    @NotBlank @Pattern(regexp = "^\\d{11}$") String tc
) {}
