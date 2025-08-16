package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
import java.time.OffsetDateTime;
@Entity @Table(name="payment_transactions") @Getter @Setter
public class PaymentTransaction extends BaseEntity {
  @Column(name="entity_type", nullable=false, length=40) private String entityType;
  @Column(name="entity_id",   nullable=false, length=36) private String entityId;
  @Column(name="transaction_type", nullable=false, length=40) private String transactionType;
  @Column(nullable=false) private double amount;
  @Column(nullable=false, length=8) private String currency = "TRY";
  @Column(name="payment_method", nullable=false, length=40) private String paymentMethod;
  @Column(name="payment_provider") private String paymentProvider;
  @Column(name="transaction_reference") private String transactionReference;
  @Column(nullable=false, length=16) private String status = "pending";
  @Column(name="processed_at", columnDefinition="timestamptz") private OffsetDateTime processedAt;
  @Column(name="failure_reason") private String failureReason;
  @Column(name="metadata", columnDefinition="jsonb") private String metadataJson;
}
