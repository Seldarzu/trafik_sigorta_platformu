package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
@Entity @Table(name="company_discount_rules") @Getter @Setter
public class CompanyDiscountRule extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="company_id")
  private InsuranceCompany company;
  @Column(name="discount_type", nullable=false) private String discountType;
  @Column(name="discount_name", nullable=false) private String discountName;
  @Column(name="conditions", columnDefinition="jsonb") private String conditionsJson;
  @Column(name="discount_percentage", nullable=false) private double discountPercentage;
  @Column(name="max_discount_amount") private Double maxDiscountAmount;
  @Column(name="is_active", nullable=false) private boolean isActive = true;
  @Column(name="valid_from", nullable=false) private java.time.LocalDate validFrom;
  @Column(name="valid_until") private java.time.LocalDate validUntil;
}
