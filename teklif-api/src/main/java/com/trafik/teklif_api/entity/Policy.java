package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.PolicyStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "quote_id")
    private String quoteId;

    @Column(name = "customer_id", nullable = false, columnDefinition = "uuid")
    private UUID customerId;

    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;

    @Column(name = "vehicle_id", nullable = false, columnDefinition = "uuid")
    private UUID vehicleId;

    @Column(name = "driver_id", nullable = false, columnDefinition = "uuid")
    private UUID driverId;

    @Column(name = "agent_id", columnDefinition = "uuid")
    private UUID agentId;

    @Column(name = "company_id", columnDefinition = "uuid")
    private UUID companyId;

    @Column(name = "premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal premium;

    @Column(name = "final_premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal finalPremium;

    @Column(name = "coverage_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal coverageAmount;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    // Enum'u DB'ye lowercase yazmak için converter
    @Convert(converter = PolicyStatusConverter.class)
    @Column(nullable = false)
    private PolicyStatus status;

    @Column(name = "total_discount", precision = 12, scale = 2)
    private BigDecimal totalDiscount;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "is_auto_renewal")
    private Boolean isAutoRenewal;

    @Column(name = "renewal_date")
    private LocalDateTime renewalDate;

    // JSONB — String tutuyoruz; JPA'ya JSON olduğunu söylüyoruz.
    // NOT: null dışında bir şey set edeceksen geçerli JSON string ver: "{\"key\":\"value\"}"
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "policy_data", columnDefinition = "jsonb")
    private String policyData;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        // id @UuidGenerator ile otomatik, ELLE set etme!
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public UUID getVehicleId() { return vehicleId; }
    public void setVehicleId(UUID vehicleId) { this.vehicleId = vehicleId; }

    public UUID getDriverId() { return driverId; }
    public void setDriverId(UUID driverId) { this.driverId = driverId; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }

    public BigDecimal getPremiumAmount() { return premium; }
    public void setPremiumAmount(BigDecimal premium) { this.premium = premium; }

    public BigDecimal getFinalPremium() { return finalPremium; }
    public void setFinalPremium(BigDecimal finalPremium) { this.finalPremium = finalPremium; }

    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public PolicyStatus getStatus() { return status; }
    public void setStatus(PolicyStatus status) { this.status = status; }

    public BigDecimal getTotalDiscount() { return totalDiscount; }
    public void setTotalDiscount(BigDecimal totalDiscount) { this.totalDiscount = totalDiscount; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Boolean getIsAutoRenewal() { return isAutoRenewal; }
    public void setIsAutoRenewal(Boolean isAutoRenewal) { this.isAutoRenewal = isAutoRenewal; }

    public LocalDateTime getRenewalDate() { return renewalDate; }
    public void setRenewalDate(LocalDateTime renewalDate) { this.renewalDate = renewalDate; }

    public String getPolicyData() { return policyData; }
    public void setPolicyData(String policyData) { this.policyData = policyData; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
