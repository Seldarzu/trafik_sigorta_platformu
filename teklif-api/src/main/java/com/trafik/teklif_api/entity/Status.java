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
        if (value == null) return null;
        return Status.valueOf(value.trim().toUpperCase(Locale.ENGLISH));
    }

    @JsonValue
    public String toValue() {
        // JSON’a küçük harfli gönderiyoruz
        return this.name().toLowerCase(Locale.ENGLISH);
    }
}
