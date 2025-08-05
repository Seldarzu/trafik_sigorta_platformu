// src/main/java/com/trafik/teklif_api/dto/PolicyResponse.java
package com.trafik.teklif_api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
//import com.trafik.teklif_api.model.PolicyStatus;

/**
 * PolicyResponse DTO — bir teklifin poliçeye dönüştürülmesi sonrası
 * istemciye döndürülecek temel poliçe bilgilerini taşır.
 */
public record PolicyResponse(
    Long id,                    // Poliçe veritabanı kimliği
    Long quoteId,               // Kaynağı olan teklifin kimliği
    Long customerId,            // Poliçeyi alan müşteri kimliği
    String policyNumber,        // Oluşturulan poliçe numarası
    BigDecimal premiumAmount,   // Nihai prim tutarı
    LocalDateTime effectiveDate,// Poliçe başlangıç tarihi/saat
    LocalDateTime expiryDate,   // Poliçe bitiş tarihi/saat
    //PolicyStatus status,        // Poliçe durumu (ACTIVE, EXPIRED, vs.)
    LocalDateTime createdAt     // Poliçe oluşturulma zamanı
) {}
//TODO:Poliçe tablosu 