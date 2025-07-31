package com.trafik.teklif_api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum RiskProfile {
    LOW,
    MEDIUM,
    HIGH;

    @JsonCreator
    public static RiskProfile from(String value) {
        if (value == null) return null;
        return RiskProfile.valueOf(value.trim().toUpperCase(Locale.ENGLISH));
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase(Locale.ENGLISH);
    }
}
