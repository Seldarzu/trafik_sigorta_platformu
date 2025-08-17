package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
import java.time.LocalDate;

@Entity @Table(name="policy_installments") @Getter @Setter
public class PolicyInstallment extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="policy_id") private Policy policy;
  @Column(name="installment_number", nullable=false) private int installmentNumber;
  @Column(nullable=false) private double amount;
  @Column(name="due_date", nullable=false) private LocalDate dueDate;
  @Column(name="paid_date") private LocalDate paidDate;
  @Column(nullable=false, length=10) private String status = "pending";
  @Column(name="payment_method") private String paymentMethod;
  @Column(name="payment_reference") private String paymentReference;
  @Column(name="late_fee", nullable=false) private double lateFee = 0.0;
  @Column(columnDefinition="text") private String notes;
}
