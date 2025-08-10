package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name="user_settings")
public class UserSettings {
    @Id @GeneratedValue @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name="user_id", unique = true, columnDefinition = "uuid")
    private UUID userId;

    @Column(name="email_notifications")
    private Boolean emailNotifications;

    @Column(name="sms_notifications")
    private Boolean smsNotifications;

    @Column(name="push_notifications")
    private Boolean pushNotifications;
}
