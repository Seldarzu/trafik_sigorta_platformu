package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
import java.time.LocalDate;
@Entity @Table(name="customer_communications") @Getter @Setter
public class CustomerCommunication extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="customer_id") private Customer customer;
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="agent_id") private User agent;
  @Column(name="communication_type", nullable=false, length=40) private String communicationType;
  @Column(nullable=false, length=16) private String direction;
  @Column(length=200) private String subject;
  @Column(columnDefinition="text", nullable=false) private String content;
  @Column(name="duration_minutes") private Integer durationMinutes;
  @Column private String outcome;
  @Column(name="follow_up_required", nullable=false) private boolean followUpRequired = false;
  @Column(name="follow_up_date") private LocalDate followUpDate;
  @Column(name="attachments", columnDefinition="jsonb") private String attachmentsJson;
}
