package com.trafik.teklif_api.dto.company;

import com.trafik.teklif_api.entity.InsuranceCompany;

public record CompanyUpsertRequest(
    String name,
    String code,
    Boolean isActive,
    ContactInfo contactInfo,
    String logoUrl
) {
  public record ContactInfo(String phone, String website, Double rating) {}

  public void applyToEntity(InsuranceCompany c) {
    if (name != null) c.setName(name);
    if (code != null) c.setCode(code);
    if (isActive != null) c.setActive(isActive);
    if (logoUrl != null) c.setLogoUrl(logoUrl);
    if (contactInfo != null) {
      if (contactInfo.phone != null)   c.setContactPhone(contactInfo.phone());
      if (contactInfo.website != null) c.setWebsiteUrl(contactInfo.website());
      if (contactInfo.rating != null)  c.setRating(contactInfo.rating());
    }
  }
}
