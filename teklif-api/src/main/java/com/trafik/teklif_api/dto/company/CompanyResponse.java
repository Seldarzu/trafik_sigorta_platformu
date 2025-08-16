package com.trafik.teklif_api.dto.company;

import com.trafik.teklif_api.entity.InsuranceCompany;

public record CompanyResponse(
    java.util.UUID id,
    String name,
    String code,
    boolean isActive,
    ContactInfo contactInfo,
    double rating,
    int totalReviews,
    String logoUrl,
    String createdAt,
    String updatedAt
) {
  public static CompanyResponse fromEntity(InsuranceCompany c) {
    return new CompanyResponse(
        c.getId(),
        c.getName(),
        c.getCode(),
        c.isActive(),
        new ContactInfo(c.getContactPhone(), c.getWebsiteUrl(), c.getRating()),
        c.getRating(),
        c.getTotalReviews(),
        c.getLogoUrl(),
        c.getCreatedAt() == null ? null : c.getCreatedAt().toString(),
        c.getUpdatedAt() == null ? null : c.getUpdatedAt().toString()
    );
  }

  public record ContactInfo(String phone, String website, double rating) {}
}
