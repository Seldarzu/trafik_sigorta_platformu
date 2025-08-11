// src/main/java/com/trafik/teklif_api/entity/NotificationSettings.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_settings")
@Immutable // read-only alias
public class NotificationSettings {

    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @Column(name="user_id", columnDefinition = "uuid", insertable = false, updatable = false)
    private UUID userId;

    @Column(name="email_notifications", insertable=false, updatable=false) private Boolean emailNotifications;
    @Column(name="sms_notifications",   insertable=false, updatable=false) private Boolean smsNotifications;
    @Column(name="push_notifications",  insertable=false, updatable=false) private Boolean pushNotifications;
    @Column(name="quote_expiry",        insertable=false, updatable=false) private Boolean quoteExpiry;
    @Column(name="new_customer",        insertable=false, updatable=false) private Boolean newCustomer;
    @Column(name="policy_renewal",      insertable=false, updatable=false) private Boolean policyRenewal;
    @Column(name="system_updates",      insertable=false, updatable=false) private Boolean systemUpdates;
    @Column(name="marketing_emails",    insertable=false, updatable=false) private Boolean marketingEmails;
    @Column(name="weekly_reports",      insertable=false, updatable=false) private Boolean weeklyReports;
    @Column(name="monthly_reports",     insertable=false, updatable=false) private Boolean monthlyReports;

    @Column(name="language",      insertable=false, updatable=false) private String language;
    @Column(name="timezone",      insertable=false, updatable=false) private String timezone;
    @Column(name="currency",      insertable=false, updatable=false) private String currency;
    @Column(name="date_format",   insertable=false, updatable=false) private String dateFormat;
    @Column(name="theme",         insertable=false, updatable=false) private String theme;
    @Column(name="auto_save",     insertable=false, updatable=false) private Boolean autoSave;
    @Column(name="session_timeout",insertable=false, updatable=false) private Integer sessionTimeout;
}
