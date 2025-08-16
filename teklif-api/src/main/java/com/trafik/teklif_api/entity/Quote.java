package com.trafik.teklif_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.trafik.teklif_api.model.AuditEntity;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.model.enums.RiskLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Entity
@Table(name = "quotes")
public class Quote extends AuditEntity {

    /* ---- PRIMARY KEY (STRING) ---- */
    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id;

    /* ---- İLİŞKİLER ---- */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    /* ---- TUTARLAR / TEMEL ALANLAR ---- */
    @Column(name = "premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal premium;

    @Column(name = "coverage_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal coverageAmount;

    @Column(name = "final_premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal finalPremium = BigDecimal.ZERO;

    @Column(name = "total_discount", precision = 12, scale = 2)
    private BigDecimal totalDiscount = BigDecimal.ZERO;

    /* ---- RİSK & DURUM ---- */
    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 20)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 12)
    private QuoteStatus status = QuoteStatus.DRAFT;

    /* ---- GEÇERLİLİK ---- */
    @Column(name = "valid_until", columnDefinition = "timestamptz", nullable = false)
    private OffsetDateTime validUntil;

    /* ---- JSONB DETAYLAR ---- */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "coverage_details", columnDefinition = "jsonb")
    private String coverageDetailsJson;

    /* ---- İLİŞKİLİ LİSTELER ---- */
    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuoteDiscount> discounts = new ArrayList<>();

    /* ---- SEÇİLEN ŞİRKET ---- */
    @Column(name = "selected_company_id", columnDefinition = "uuid")
    private UUID selectedCompanyId;

    /* ---- ID OLUŞTURMA ---- */
    @PrePersist
    private void ensureId() {
        if (this.id == null || this.id.isBlank()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    /* =======================
       GETTERS / SETTERS
       ======================= */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public BigDecimal getPremium() { return premium; }
    public void setPremium(BigDecimal premium) { this.premium = premium; }

    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }

    public BigDecimal getFinalPremium() { return finalPremium; }
    public void setFinalPremium(BigDecimal finalPremium) { this.finalPremium = finalPremium; }

    public BigDecimal getTotalDiscount() { return totalDiscount; }
    public void setTotalDiscount(BigDecimal totalDiscount) { this.totalDiscount = totalDiscount; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus status) { this.status = status; }

    public OffsetDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(OffsetDateTime validUntil) { this.validUntil = validUntil; }

    public String getCoverageDetailsJson() { return coverageDetailsJson; }
    public void setCoverageDetailsJson(String coverageDetailsJson) { this.coverageDetailsJson = coverageDetailsJson; }

    public List<QuoteDiscount> getDiscounts() { return discounts; }
    public void setDiscounts(List<QuoteDiscount> discounts) { this.discounts = discounts; }

    public UUID getSelectedCompanyId() { return selectedCompanyId; }
    public void setSelectedCompanyId(UUID selectedCompanyId) { this.selectedCompanyId = selectedCompanyId; }

    /* ---- Yardımcı metodlar ---- */
    public Quote addDiscount(QuoteDiscount discount) {
        if (discount != null) {
            discounts.add(discount);
            discount.setQuote(this);
        }
        return this;
    }

    public Quote removeDiscount(QuoteDiscount discount) {
        if (discount != null) {
            discounts.remove(discount);
            discount.setQuote(null);
        }
        return this;
    }
}
