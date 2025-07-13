package com.trafik.teklif_api.dto;
/*Teklif oluşturma isteğinde zorunlu müşteri ID ve opsiyonel risk/prim verilerini alır.

API’nin iş mantığı katmanına (servis) temiz, doğrulanmış giriş sağlar. */
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateQuoteRequest {

  @NotNull(message = "Müşteri ID boş olamaz")
  private Long customerId;

  @Min(value = 0, message = "Risk skoru negatif olamaz")
  private Integer riskScore;

  // Eğer client prim teklifini gönderecekse, yoksa service hesaplayacak
  private Double premiumAmount;

  // — Getter/Setter —
  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }

  public Integer getRiskScore() { return riskScore; }
  public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

  public Double getPremiumAmount() { return premiumAmount; }
  public void setPremiumAmount(Double premiumAmount) { this.premiumAmount = premiumAmount; }
}
