package com.trafik.teklif_api.entity;
import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*; import lombok.Getter; import lombok.Setter;
@Entity @Table(name="company_ratings") @Getter @Setter
public class CompanyRating extends BaseEntity {
  @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="company_id")
  private InsuranceCompany company;
  @Column(name="overall_rating", nullable=false) private double overallRating;
  @Column(name="price_rating", nullable=false) private double priceRating;
  @Column(name="service_rating", nullable=false) private double serviceRating;
  @Column(name="claim_process_rating", nullable=false) private double claimProcessRating;
  @Column(name="review_text") private String reviewText;
  @Column private String pros;
  @Column private String cons;
  @Column(name="would_recommend", nullable=false) private boolean wouldRecommend = true;
}
