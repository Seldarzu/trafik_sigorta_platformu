package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
import java.time.LocalDate;
@Entity @Table(name="loyalty_transactions") @Getter @Setter
public class LoyaltyTransaction extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="customer_id") private Customer customer;
  @Column(name="transaction_type", nullable=false, length=40) private String transactionType;
  @Column(nullable=false) private int points;
  @Column(nullable=false, length=200) private String reason;
  @Column(name="reference_type") private String referenceType;
  @Column(name="reference_id") private String referenceId;
  @Column(name="expiry_date") private LocalDate expiryDate;
  @Column(name="processed_by") private String processedBy;
}
