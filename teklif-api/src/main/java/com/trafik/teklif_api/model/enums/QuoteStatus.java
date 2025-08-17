package com.trafik.teklif_api.model.enums;

/**
 * Birleştirilmiş QuoteStatus enum.
 * - İlk sürümdeki (PENDING, APPROVED, REJECTED)
 * - İkinci sürümdeki (DRAFT, ACTIVE, EXPIRED, SOLD)
 * tüm durumlar dahil edilmiştir.
 * - Java enum standardına uygun olarak büyük harf ile tanımlanmıştır.
 */
public enum QuoteStatus {
    PENDING,
    APPROVED,
    REJECTED,
    DRAFT,
    ACTIVE,
    EXPIRED,
    SOLD
}
