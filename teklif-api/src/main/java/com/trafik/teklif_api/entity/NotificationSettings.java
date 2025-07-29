package com.trafik.teklif_api.entity;

import lombok.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="notification_settings")
public class NotificationSettings {
    @Id
    private Long userId;  // PK = userId

    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean pushNotifications;
}
