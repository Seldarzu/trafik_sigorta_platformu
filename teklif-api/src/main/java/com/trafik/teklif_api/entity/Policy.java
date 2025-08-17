package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import com.trafik.teklif_api.model.enums.PaymentStatus;
import com.trafik.teklif_api.model.enums.PolicyStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "policies")
public class Policy extends BaseEntity {

    /* ---- İLİŞKİLER ---- */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "quote_id")
    private Quote quote;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private InsuranceCompany company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    /* ---- TEMEL ALANLAR ---- */
    @Column(name = "policy_number", nullable = false, unique = true, length = 40)
    private String policyNumber;

    @Column(name = "premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal premium;

    @Column(name = "final_premium", precision = 12, scale = 2, nullable = false)
    private BigDecimal finalPremium;

    @Column(name = "coverage_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal coverageAmount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 12)
    private PolicyStatus status = PolicyStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 10)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    /* ---- EK ALANLAR ---- */
    @Column(name = "total_discount", precision = 12, scale = 2)
    private BigDecimal totalDiscount;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_level", length = 32)
    private String riskLevel;

    @Column(name = "is_auto_renewal")
    private Boolean isAutoRenewal = Boolean.FALSE;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    // JSONB saklama alanı (opsiyonel poliçe verileri)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "policy_data", columnDefinition = "jsonb")
    private String policyData;

    /* ---- İLİŞKİLİ LİSTELER ---- */
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PolicyInstallment> installments = new ArrayList<>();

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PolicyClaim> claims = new ArrayList<>();
}
