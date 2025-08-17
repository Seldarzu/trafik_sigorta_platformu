package com.trafik.teklif_api.entity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
@Entity @Table(name="quote_discounts") @Getter @Setter
public class QuoteDiscount {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="quote_id") private Quote quote;
  @Column(nullable=false, length=40) private String type;
  @Column(nullable=false, length=120) private String name;
  @Column(nullable=false) private double percentage;
  @Column(nullable=false) private double amount;
}
