// src/test/java/com/trafik/teklif_api/service/impl/CustomerServiceImplTest.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateCustomerNoteRequest;
import com.trafik.teklif_api.dto.CustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.dto.CustomerSearchResponse;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.CustomerNote;
import com.trafik.teklif_api.entity.CustomerValue;
import com.trafik.teklif_api.entity.RiskProfile;
import com.trafik.teklif_api.entity.Status;
import com.trafik.teklif_api.repository.CustomerNoteRepository;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock CustomerRepository customerRepo;
    @Mock QuoteRepository quoteRepo;
    @Mock PolicyRepository policyRepo;
    @Mock CustomerNoteRepository noteRepo;

    @InjectMocks CustomerServiceImpl service;

    private Customer customer;
    private UUID CUSTOMER_ID;

    // Yardımcı: enum sabitleri adlarından bağımsız güvenli seçim
    private static CustomerValue anyCustomerValue() {
        CustomerValue[] vals = CustomerValue.values();
        return vals.length == 0 ? null : vals[0];
    }
    private static CustomerValue anotherCustomerValue() {
        CustomerValue[] vals = CustomerValue.values();
        return vals.length <= 1 ? anyCustomerValue() : vals[vals.length - 1];
    }

    @BeforeEach
    void setup() {
        CUSTOMER_ID = UUID.randomUUID();
        customer = new Customer();
        customer.setId(CUSTOMER_ID);
        customer.setTcNumber("12345678901");
        customer.setFirstName("Ali");
        customer.setLastName("Veli");
        customer.setBirthDate(LocalDate.of(1990,1,1));
        customer.setPhone("5551112233");
        customer.setEmail("ali@example.com");
        customer.setAddress("adres");
        customer.setCity("İstanbul");        
        customer.setRiskProfile(RiskProfile.LOW);
        customer.setCustomerValue(anyCustomerValue());
        customer.setNotes("N1");
        customer.setRegistrationDate(LocalDate.of(2024,1,1));
    }

    @Test
    void getAll_ok() {
        when(customerRepo.findAll()).thenReturn(List.of(customer));
        List<CustomerResponse> res = service.getAllCustomers();
        assertThat(res).hasSize(1);
        assertThat(res.get(0).getFirstName()).isEqualTo("Ali");
    }

    @Test
    void getById_ok() {
        when(customerRepo.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        CustomerResponse res = service.getCustomerById(CUSTOMER_ID);
        assertThat(res.getEmail()).isEqualTo("ali@example.com");
    }

    @Test
    void create_ok() {
        when(customerRepo.save(any(Customer.class))).thenAnswer(inv -> {
            Customer c = inv.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        CustomerRequest req = new CustomerRequest(
                "12345678901",
                "Ayşe",
                "Yılmaz",
                LocalDate.of(1995,5,5),
                "5550001122",
                "ayse@example.com",
                "adres",
                "Ankara",
                Status.ACTIVE,            // status
                RiskProfile.LOW,          // riskProfile
                anyCustomerValue(),       // customerValue
                "notlar"                  // notes (EN SON)
        );

        CustomerResponse res = service.createCustomer(req);
        assertThat(res.getFirstName()).isEqualTo("Ayşe");
        assertThat(res.getStatus()).isEqualTo(Status.ACTIVE);
    }

    @Test
    void update_ok() {
        when(customerRepo.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        when(customerRepo.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        CustomerRequest req = new CustomerRequest(
                "12345678901",
                "Mehmet",
                "Demir",
                LocalDate.of(1988,3,3),
                "5559998877",
                "mehmet@example.com",
                "adres2",
                "İzmir",
                Status.ACTIVE,               // status
                RiskProfile.MEDIUM,          // riskProfile
                anotherCustomerValue(),      // customerValue
                "n2"                         // notes (EN SON)
        );

        CustomerResponse res = service.updateCustomer(CUSTOMER_ID, req);
        assertThat(res.getFirstName()).isEqualTo("Mehmet");
        assertThat(res.getCity()).isEqualTo("İzmir");
    }

    @Test
    void addNote_ok() {
        when(customerRepo.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        when(noteRepo.save(any(CustomerNote.class))).thenAnswer(inv -> inv.getArgument(0));

        var out = service.addCustomerNote(CUSTOMER_ID, new CreateCustomerNoteRequest("Merhaba"));
        assertThat(out.note()).isEqualTo("Merhaba");
        verify(noteRepo).save(any(CustomerNote.class));
    }

    @Test
    void search_ok() {
        // Jenerik uyarısını engellemek için tür parametresi veriyoruz
        when(customerRepo.findAll(ArgumentMatchers.<Specification<Customer>>any()))
                .thenReturn(List.of(customer));

        List<CustomerSearchResponse> list = service.searchCustomers("ali");
        assertThat(list).hasSize(1);
        assertThat(list.get(0).email()).isEqualTo("ali@example.com");
    }
}
