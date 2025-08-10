// src/main/java/com/trafik/teklif_api/entity/Notification.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;  // DB: UUID PK

    @Column(name = "user_id", columnDefinition = "uuid")
    private UUID userId; // nullable olabilir

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "text")
    private String message;

    @Column(name = "type", length = 20)
    private String type; // info | success | warning | error

    @Column(name = "is_read")
    private Boolean isRead = Boolean.FALSE;

    @Column(name = "action_url")
    private String actionUrl;

    @Column(name = "action_text", length = 100)
    private String actionText;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
