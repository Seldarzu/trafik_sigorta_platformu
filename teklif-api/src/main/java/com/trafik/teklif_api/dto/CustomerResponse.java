package com.trafik.teklif_api.dto;

import java.time.LocalDate;

public record CustomerResponse(
    Long id,
    String tcNo,
    String name,
    LocalDate birthDate,
    String phone
) {}
