// src/main/java/com/trafik/teklif_api/model/enums/Education.java
package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Education {
    PRIMARY,
    SECONDARY,
    HIGH_SCHOOL,
    UNIVERSITY,
    POSTGRADUATE;

    @JsonCreator
    public static Education from(String v) {
        if (v == null) return null;
        return Education.valueOf(v.trim().toUpperCase());
    }
}
