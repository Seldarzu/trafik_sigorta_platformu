package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
@Entity @Table(name="quote_history") @Getter @Setter
public class QuoteHistory extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="quote_id") private Quote quote;
  @Column(name="event_type", nullable=false) private String eventType;
  @Column(name="payload", columnDefinition="jsonb") private String payloadJson;
}
