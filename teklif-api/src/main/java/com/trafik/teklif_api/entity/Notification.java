// src/main/java/com/trafik/teklif_api/entity/Notification.java
package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // nullable olabilir
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "text", nullable = false)
    private String message;

    @Column(nullable = false, length = 20)
    private String type = "info"; // info | success | warning | error

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "action_url")
    private String actionUrl;

    @Column(name = "action_text", length = 100)
    private String actionText;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
