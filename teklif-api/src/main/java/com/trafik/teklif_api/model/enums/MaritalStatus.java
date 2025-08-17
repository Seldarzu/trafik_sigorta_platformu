// src/main/java/com/trafik/teklif_api/model/enums/MaritalStatus.java
package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MaritalStatus {
    SINGLE,
    MARRIED,
    DIVORCED,
    WIDOWED;

    @JsonCreator
    public static MaritalStatus from(String v) {
        if (v == null) return null;
        return MaritalStatus.valueOf(v.trim().toUpperCase());
    }
}
