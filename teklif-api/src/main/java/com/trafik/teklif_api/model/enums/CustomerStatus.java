package com.trafik.teklif_api.model.enums;

/**
 * Birleştirilmiş CustomerStatus enum.
 * - İlk sürümdeki büyük harf formatı (POTENTIAL, ACTIVE, INACTIVE) korunur.
 * - İkinci sürümdeki sıralama (active, inactive, potential) da dikkate alınmıştır.
 */
public enum CustomerStatus {
    ACTIVE,
    INACTIVE,
    POTENTIAL
}
