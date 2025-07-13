package com.trafik.teklif_api.dto;
/*Quote entity’sindeki tüm teknik alanları (entity ilişkileri, lazy loading vs.) expose etmeden,

REST API’ye düz, JSON-uyumlu tiplerle (String, BigDecimal, LocalDateTime) cevap döner */
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class QuoteResponse {
  
  private Long id;
  private Long customerId;
  private BigDecimal premiumAmount;
  private Integer riskScore;
  private String status;
  private String uniqueRefNo;
  private LocalDateTime createdAt;

  // — Getter/Setter’lar —
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }

  public BigDecimal getPremiumAmount() { return premiumAmount; }
  public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }

  public Integer getRiskScore() { return riskScore; }
  public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getUniqueRefNo() { return uniqueRefNo; }
  public void setUniqueRefNo(String uniqueRefNo) { this.uniqueRefNo = uniqueRefNo; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
