package com.trafik.teklif_api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
  name = "quotes",
  indexes = @Index(name = "idx_quotes_ref_no", columnList = "ref_no", unique = true)
)
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ref_no", length = 20, nullable = false, unique = true)
    private String refNo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(optional = false)
    @JoinColumn(
      name = "customer_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_quotes_customer")
    )
    private Customer customer;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "premium_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal premiumAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private QuoteStatus status;

    public Quote() {}

    // ----- Getters & Setters -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefNo() {
        return refNo;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }

    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }
}
