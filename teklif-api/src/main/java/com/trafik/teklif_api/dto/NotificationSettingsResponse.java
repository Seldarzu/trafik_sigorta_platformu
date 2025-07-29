package com.trafik.teklif_api.dto;

public record NotificationSettingsResponse(
    Boolean emailNotifications,
    Boolean smsNotifications,
    Boolean pushNotifications
) {}
