package com.trafik.teklif_api.service;

import com.trafik.teklif_api._base.UnitTest;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.InsuranceCompany;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CompanyPricingServiceTest extends UnitTest {

  @Mock QuoteRepository quoteRepo;
  @Mock InsuranceCompanyRepository companyRepo;

  @InjectMocks CompanyPricingService service;

  @Test
  void should_buildCompanyOffers_basic() {
    Quote q = new Quote();
    Vehicle v = new Vehicle();
    Driver d = new Driver();

    InsuranceCompany a = new InsuranceCompany(); a.setName("A");
    InsuranceCompany b = new InsuranceCompany(); b.setName("B");

    var offers = service.buildCompanyOffers(q, v, d, List.of(a, b));
    assertThat(offers).hasSize(2);
    assertThat(offers).extracting("companyName").containsExactlyInAnyOrder("A","B");
  }
}
