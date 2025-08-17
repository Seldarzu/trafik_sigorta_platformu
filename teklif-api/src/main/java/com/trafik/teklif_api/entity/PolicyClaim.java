// src/main/java/com/trafik/teklif_api/entity/PolicyClaim.java
package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;

@Entity
@Table(name = "policy_claims")
@Getter
@Setter
public class PolicyClaim extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "claim_number", nullable = false, unique = true, length = 40)
    private String claimNumber;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "claim_type", nullable = false, length = 40)
    private String claimType;

    @Column(columnDefinition = "text", nullable = false)
    private String description;

    @Column(name = "incident_location")
    private String incidentLocation;

    @Column(name = "police_report_number")
    private String policeReportNumber;

    @Column(name = "estimated_amount", nullable = false)
    private double estimatedAmount;

    @Column(name = "approved_amount")
    private Double approvedAmount;

    @Column(name = "paid_amount")
    private Double paidAmount;

    @Column(nullable = false, length = 20)
    private String status = "reported"; // reported | investigating | approved | rejected | paid

    @Column(name = "adjuster_name")
    private String adjusterName;

    @Column(name = "adjuster_phone")
    private String adjusterPhone;

    @Column(name = "settlement_date")
    private LocalDate settlementDate;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "documents", columnDefinition = "jsonb")
    private String documentsJson;

    @Column(columnDefinition = "text")
    private String notes;
}
