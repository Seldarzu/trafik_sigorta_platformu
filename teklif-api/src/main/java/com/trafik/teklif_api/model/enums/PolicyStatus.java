package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PolicyStatus { ACTIVE, EXPIRED, CANCELLED, PENDING;

  @JsonCreator
  public static PolicyStatus from(String v) {
    if (v == null) return null;
    return PolicyStatus.valueOf(v.trim().toUpperCase());
  }
}
