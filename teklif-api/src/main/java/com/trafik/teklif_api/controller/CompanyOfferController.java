// src/main/java/com/trafik/teklif_api/controller/CompanyOfferController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.company.CompanyQuoteDto;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.InsuranceCompany;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.repository.VehicleRepository;
import com.trafik.teklif_api.service.CompanyPricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class CompanyOfferController {

    private final CompanyPricingService pricingService;
    private final QuoteRepository quoteRepo;               // <Quote, String>
    private final VehicleRepository vehicleRepo;           // <Vehicle, UUID>
    private final DriverRepository driverRepo;             // <Driver, UUID>
    private final InsuranceCompanyRepository companyRepo;  // <InsuranceCompany, UUID>

    /** Teklif (quote) için şirket bazlı fiyat teklifleri */
    @GetMapping("/{id}/company-offers")
    public List<CompanyQuoteDto> getCompanyOffers(@PathVariable("id") UUID quoteId) {
        return pricingService.generateOffers(quoteId); // overload UUID -> String yönlendirme içeride
    }

    /** Bir quote için şirket seçimi */
    @PostMapping("/{id}/select-company")
    public Quote selectCompany(@PathVariable("id") UUID quoteId,
                               @RequestParam UUID companyId) {

        // Repo ID tipi String olduğundan UUID -> String
        Quote q = quoteRepo.findById(quoteId.toString()).orElseThrow();

        // İlgili varlıkları doğrula
        Vehicle v = vehicleRepo.findById(q.getVehicle().getId()).orElseThrow();
        Driver  d = driverRepo.findById(q.getDriver().getId()).orElseThrow();
        InsuranceCompany company = companyRepo.findById(companyId).orElseThrow();

        // Seçilen şirket için teklif üret ve quote’u güncelle
        List<CompanyQuoteDto> offers = pricingService.buildCompanyOffers(q, v, d, List.of(company));
        CompanyQuoteDto offer = offers.get(0);

        q.setSelectedCompanyId(company.getId());
        q.setPremium(offer.premium());
        q.setFinalPremium(offer.finalPremium());
        q.setCoverageAmount(offer.coverageAmount());

        return quoteRepo.save(q);
    }
}
