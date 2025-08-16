package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum FuelType {
  GASOLINE, DIESEL, LPG, ELECTRIC, HYBRID;

  @JsonCreator
  public static FuelType from(String v) {
    if (v == null) return null;
    return FuelType.valueOf(v.trim().toUpperCase());
  }
}
