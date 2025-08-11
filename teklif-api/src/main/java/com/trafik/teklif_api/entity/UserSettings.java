// src/main/java/com/trafik/teklif_api/entity/UserSettings.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user_settings", uniqueConstraints = {
        @UniqueConstraint(name = "user_settings_user_id_key", columnNames = "user_id")
})
public class UserSettings {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "uuid", nullable = false)
    private UUID userId;

    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    @Column(name = "sms_notifications")
    private Boolean smsNotifications;

    @Column(name = "push_notifications")
    private Boolean pushNotifications;

    @Column(name = "quote_expiry")
    private Boolean quoteExpiry;

    @Column(name = "new_customer")
    private Boolean newCustomer;

    @Column(name = "policy_renewal")
    private Boolean policyRenewal;

    @Column(name = "system_updates")
    private Boolean systemUpdates;

    @Column(name = "marketing_emails")
    private Boolean marketingEmails;

    @Column(name = "weekly_reports")
    private Boolean weeklyReports;

    @Column(name = "monthly_reports")
    private Boolean monthlyReports;

    @Column(name = "language", length = 5)
    private String language;

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "currency", length = 5)
    private String currency;

    @Column(name = "date_format", length = 20)
    private String dateFormat;

    @Column(name = "theme", length = 20)
    private String theme;

    @Column(name = "auto_save")
    private Boolean autoSave;

    @Column(name = "session_timeout")
    private Integer sessionTimeout;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
