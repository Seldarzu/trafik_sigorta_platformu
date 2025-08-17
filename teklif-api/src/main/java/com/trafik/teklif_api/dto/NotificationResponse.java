// src/main/java/com/trafik/teklif_api/dto/NotificationResponse.java
package com.trafik.teklif_api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    String title,
    String message,
    String type,
    Boolean isRead,
    OffsetDateTime createdAt,
    String actionUrl,
    String actionText
) {}
