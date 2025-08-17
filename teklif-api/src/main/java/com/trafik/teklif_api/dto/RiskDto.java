package com.trafik.teklif_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiskDto {
    private String level;     // "low", "medium", "high"
    private long count;       // müşteri sayısı
    private double percentage; // yüzdesi
    private String color;     // renk kodu (#10B981, #F59E0B, #EF4444)
}
