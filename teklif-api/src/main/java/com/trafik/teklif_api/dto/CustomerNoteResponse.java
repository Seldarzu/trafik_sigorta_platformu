// src/main/java/com/trafik/teklif_api/dto/CustomerNoteResponse.java
package com.trafik.teklif_api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CustomerNoteResponse(
    UUID id,
    String note,
    OffsetDateTime createdAt
) {}
