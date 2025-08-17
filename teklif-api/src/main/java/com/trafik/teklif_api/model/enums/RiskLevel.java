package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum RiskLevel {
    LOW, MEDIUM, HIGH;

    
    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static RiskLevel from(Object value) {
        if (value == null) return MEDIUM;
        String s = value.toString().trim();
        if (s.isEmpty()) return MEDIUM;
        return RiskLevel.valueOf(s.toUpperCase(Locale.ROOT));
    }

    @JsonValue
    public String toJson() {
        return name(); 
    }
}
