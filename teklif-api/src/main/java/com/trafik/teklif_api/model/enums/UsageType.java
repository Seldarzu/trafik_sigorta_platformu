package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UsageType {
  PERSONAL, COMMERCIAL, TAXI, TRUCK;

  @JsonCreator
  public static UsageType from(String v) {
    if (v == null) return null;
    return UsageType.valueOf(v.trim().toUpperCase());
  }
}
