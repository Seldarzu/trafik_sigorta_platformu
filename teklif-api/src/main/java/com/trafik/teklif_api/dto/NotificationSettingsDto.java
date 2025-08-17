package com.trafik.teklif_api.dto;

import lombok.Data;

@Data
public class NotificationSettingsDto {
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean pushNotifications;
    private Boolean quoteExpiry;
    private Boolean newCustomer;
    private Boolean policyRenewal;
    private Boolean systemUpdates;
    private Boolean marketingEmails;
    private Boolean weeklyReports;
    private Boolean monthlyReports;

    private String language;
    private String timezone;
    private String currency;
    private String dateFormat;
    private String theme;
    private Boolean autoSave;
    private Integer sessionTimeout;
}
