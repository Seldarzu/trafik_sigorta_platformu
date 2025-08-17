// src/main/java/com/trafik/teklif_api/controller/CompanyController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.company.CompanyResponse;
import com.trafik.teklif_api.dto.company.CompanyUpsertRequest;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

  private final InsuranceCompanyRepository repo;
  private final CompanyRatingRepository ratingRepo;
  private final CoverageTemplateRepository templateRepo;
  private final CompanyDiscountRuleRepository discountRepo;

  @GetMapping("")
  public Page<CompanyResponse> list(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "50") int size,
                                    @RequestParam(required = false) Boolean active) {
    Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(200, Math.max(1, size)));
    Page<InsuranceCompany> all = repo.findAll(pageable);
    List<InsuranceCompany> filtered = all.getContent().stream()
        .filter(c -> active == null || c.isActive() == active.booleanValue())
        .toList();

    // totalElements filtreye göre düzeltilir:
    return new PageImpl<>(
        filtered.stream().map(CompanyResponse::fromEntity).toList(),
        pageable,
        filtered.size()
    );
  }

  @PostMapping("")
  public CompanyResponse create(@Valid @RequestBody CompanyUpsertRequest req) {
    InsuranceCompany c = new InsuranceCompany();
    req.applyToEntity(c);
    return CompanyResponse.fromEntity(repo.save(c));
  }

  @GetMapping("/{id}")
  public CompanyResponse get(@PathVariable UUID id) {
    return CompanyResponse.fromEntity(repo.findById(id).orElseThrow());
  }

  @PutMapping("/{id}")
  public CompanyResponse update(@PathVariable UUID id, @Valid @RequestBody CompanyUpsertRequest req) {
    InsuranceCompany c = repo.findById(id).orElseThrow();
    req.applyToEntity(c);
    return CompanyResponse.fromEntity(repo.save(c));
  }

  /** FE’de toggleActive için kullanılıyor */
  @PatchMapping("/{id}")
  public CompanyResponse patch(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
    InsuranceCompany c = repo.findById(id).orElseThrow();
    if (body.containsKey("isActive")) {
      Object v = body.get("isActive");
      c.setActive(v instanceof Boolean ? (Boolean) v : Boolean.parseBoolean(String.valueOf(v)));
    }
    if (body.containsKey("name")) c.setName(String.valueOf(body.get("name")));
    if (body.containsKey("code")) c.setCode(String.valueOf(body.get("code")));
    if (body.containsKey("logoUrl")) c.setLogoUrl(String.valueOf(body.get("logoUrl")));
    if (body.containsKey("contactInfo")) {
      @SuppressWarnings("unchecked")
      Map<String,Object> ci = (Map<String, Object>) body.get("contactInfo");
      if (ci != null) {
        if (ci.get("phone")   != null) c.setContactPhone(String.valueOf(ci.get("phone")));
        if (ci.get("website") != null) c.setWebsiteUrl(String.valueOf(ci.get("website")));
        if (ci.get("rating")  != null) c.setRating(Double.parseDouble(String.valueOf(ci.get("rating"))));
      }
    }
    return CompanyResponse.fromEntity(repo.save(c));
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable UUID id) {
    repo.deleteById(id);
  }

  /* ---- ilişkili veriler ---- */

  @GetMapping("/{id}/templates")
  public List<CoverageTemplate> templates(@PathVariable UUID id,
                                          @RequestParam(required=false) Boolean active) {
    if (Boolean.TRUE.equals(active))  return templateRepo.findByCompanyIdAndIsActive(id, true);
    if (Boolean.FALSE.equals(active)) return templateRepo.findByCompanyIdAndIsActive(id, false);
    return templateRepo.findByCompanyId(id);
  }

  @GetMapping("/{id}/discounts")
  public List<CompanyDiscountRule> discounts(@PathVariable UUID id,
                                             @RequestParam(required=false) Boolean active) {
    if (Boolean.TRUE.equals(active))  return discountRepo.findByCompanyIdAndIsActive(id, true);
    if (Boolean.FALSE.equals(active)) return discountRepo.findByCompanyIdAndIsActive(id, false);
    return discountRepo.findByCompanyId(id);
  }

  @GetMapping("/{id}/ratings")
  public List<CompanyRating> ratings(@PathVariable UUID id) {
    return ratingRepo.findAll().stream()
        .filter(r -> r.getCompany().getId().equals(id))
        .collect(Collectors.toList());
  }

  @PostMapping("/{id}/rate")
  public CompanyRating rate(@PathVariable UUID id, @RequestBody CompanyRating r) {
    r.setCompany(repo.findById(id).orElseThrow());
    return ratingRepo.save(r);
  }
}
