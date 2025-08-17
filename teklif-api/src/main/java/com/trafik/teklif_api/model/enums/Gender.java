package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Gender { MALE, FEMALE;

  @JsonCreator
  public static Gender from(String v) {
    if (v == null) return null;
    return Gender.valueOf(v.trim().toUpperCase());
  }
}
