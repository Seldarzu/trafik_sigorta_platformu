package com.trafik.teklif_api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Locale;

public enum Status {
    ACTIVE,
    INACTIVE,
    POTENTIAL;

    @JsonCreator
    public static Status from(String value) {
        if (value == null) {
            return null;
        }
        // Mutlaka İngilizce locale ile uppercase
        return Status.valueOf(value.trim().toUpperCase(Locale.ENGLISH));
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
