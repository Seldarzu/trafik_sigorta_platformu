package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotNull;

public record NotificationSettingsRequest(
    @NotNull Boolean emailNotifications,
    @NotNull Boolean smsNotifications,
    @NotNull Boolean pushNotifications
) {}
