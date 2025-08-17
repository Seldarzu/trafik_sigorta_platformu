package com.trafik.teklif_api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentStatus { PAID, PENDING, OVERDUE;

  @JsonCreator
  public static PaymentStatus from(String v) {
    if (v == null) return null;
    return PaymentStatus.valueOf(v.trim().toUpperCase());
  }
}
