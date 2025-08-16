// src/main/java/com/trafik/teklif_api/service/impl/CustomerServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateCustomerNoteRequest;
import com.trafik.teklif_api.dto.CustomerNoteResponse;
import com.trafik.teklif_api.dto.CustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.dto.CustomerSearchResponse;
import com.trafik.teklif_api.dto.DriverSummary;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.dto.VehicleSummary;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.CustomerNote;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.model.enums.CustomerStatus;
import com.trafik.teklif_api.repository.CustomerNoteRepository;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// DTO tarafında Status com.trafik.teklif_api.entity.Status olarak bekleniyor.
import com.trafik.teklif_api.entity.Status;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepo;
    private final QuoteRepository quoteRepo;
    private final PolicyRepository policyRepo;
    private final CustomerNoteRepository noteRepo;

    /* ------------------ CRUD ------------------ */

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepo.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerById(UUID id) {
        Customer c = customerRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + id));
        return mapToResponse(c);
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest req) {
        Customer c = new Customer();
        c.setTcNumber(req.tcNumber());
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setBirthDate(req.birthDate());
        c.setPhone(req.phone());
        c.setEmail(req.email());
        c.setAddress(req.address());
        c.setCity(req.city());

        // DTO: entity.Status -> Entity: CustomerStatus
        if (req.status() != null) {
            c.setStatus(CustomerStatus.valueOf(req.status().name()));
        }

        c.setRiskProfile(req.riskProfile());
        c.setCustomerValue(req.customerValue());
        c.setNotes(req.notes());

        Customer saved = customerRepo.save(c);
        return mapToResponse(saved);
    }

    @Override
    public CustomerResponse updateCustomer(UUID id, CustomerRequest req) {
        return customerRepo.findById(id)
            .map(c -> {
                c.setTcNumber(req.tcNumber());
                c.setFirstName(req.firstName());
                c.setLastName(req.lastName());
                c.setBirthDate(req.birthDate());
                c.setPhone(req.phone());
                c.setEmail(req.email());
                c.setAddress(req.address());
                c.setCity(req.city());

                if (req.status() != null) {
                    c.setStatus(CustomerStatus.valueOf(req.status().name()));
                }

                c.setRiskProfile(req.riskProfile());
                c.setCustomerValue(req.customerValue());
                c.setNotes(req.notes());
                return customerRepo.save(c);
            })
            .map(this::mapToResponse)
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + id));
    }

    @Override
    public void deleteCustomer(UUID id) {
        customerRepo.deleteById(id);
    }

    /* --------- Ek işlemler: müşteri teklif & poliçe & not --------- */

    @Override
    public List<QuoteResponse> getCustomerQuotes(UUID customerId) {
        return quoteRepo.findByCustomerIdOrderByCreatedAtDesc(customerId)
            .stream()
            .map(q -> {
                Vehicle v = q.getVehicle();
                Driver  d = q.getDriver();

                VehicleSummary vehicleDto = (v == null) ? null :
                    new VehicleSummary(
                        v.getBrand(),
                        v.getModel(),
                        v.getYear(),
                        v.getPlateNumber()
                    );

                DriverSummary driverDto = (d == null) ? null :
                    new DriverSummary(
                        d.getFirstName(),
                        d.getLastName(),
                        d.getProfession(),
                        d.isHasAccidents(),
                        d.isHasViolations()
                    );

                return new QuoteResponse(
                    q.getId(),
                    // Quote -> Customer ilişkisinden
                    q.getCustomer() != null ? q.getCustomer().getId() : null,
                    q.getVehicle()  != null ? q.getVehicle().getId()  : null,
                    q.getDriver()   != null ? q.getDriver().getId()   : null,
                    q.getAgent()    != null ? q.getAgent().getId()    : null,

                    q.getRiskScore(),
                    q.getRiskLevel() != null ? q.getRiskLevel().name() : null,
                    q.getStatus(),

                    q.getPremium(),
                    q.getCoverageAmount(),
                    q.getFinalPremium(),
                    q.getTotalDiscount(),

                    q.getValidUntil(),
                    q.getCreatedAt(),

                    vehicleDto,
                    driverDto,

                    // companyName: müşteride tuttuğumuz son/tercih edilen şirket
                    q.getCustomer() != null ? q.getCustomer().getPreferredCompanyName() : null
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<PolicyResponse> getCustomerPolicies(UUID customerId) {
        return policyRepo.findByCustomerIdOrderByEndDateDesc(customerId)
            .stream()
            .map(p -> {
                // Vehicle/Driver özetleri
                VehicleSummary v = null;
                if (p.getVehicle() != null) {
                    var veh = p.getVehicle();
                    v = new VehicleSummary(
                        veh.getBrand(),
                        veh.getModel(),
                        veh.getYear(),
                        veh.getPlateNumber()
                    );
                }
                DriverSummary d = null;
                if (p.getDriver() != null) {
                    var dr = p.getDriver();
                    d = new DriverSummary(
                        dr.getFirstName(),
                        dr.getLastName(),
                        dr.getProfession(),
                        dr.isHasAccidents(),
                        dr.isHasViolations()
                    );
                }

                String quoteIdStr = (p.getQuote() != null) ? p.getQuote().getId() : null;
                UUID custId       = (p.getCustomer() != null) ? p.getCustomer().getId() : null;
                String company    = (p.getCompany() != null) ? p.getCompany().getName() : null;

                LocalDateTime startDt = p.getStartDate() != null ? p.getStartDate().atStartOfDay() : null;
                LocalDateTime endDt   = p.getEndDate()   != null ? p.getEndDate().atStartOfDay()   : null;
                LocalDateTime created = p.getCreatedAt() != null ? p.getCreatedAt().toLocalDateTime() : null;

                return new PolicyResponse(
                    p.getId(),
                    quoteIdStr,
                    custId,
                    p.getPolicyNumber(),

                    p.getFinalPremium(),
                    p.getCoverageAmount(),
                    p.getTotalDiscount(),

                    p.getStatus(),
                    p.getPaymentStatus(),

                    startDt,
                    endDt,
                    created,

                    v,
                    d,
                    company
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public CustomerNoteResponse addCustomerNote(UUID customerId, CreateCustomerNoteRequest req) {
        Customer cust = customerRepo.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + customerId));

        CustomerNote note = new CustomerNote();
        note.setCustomer(cust);
        note.setNote(req.note());

        CustomerNote saved = noteRepo.save(note);
        return new CustomerNoteResponse(
            saved.getId(),
            saved.getNote(),
            saved.getCreatedAt()
        );
    }

    /* ------------------ Arama ------------------ */

    @Override
    public List<CustomerSearchResponse> searchCustomers(String q) {
        Specification<Customer> spec = (root, query, cb) -> {
            String pattern = "%" + (q == null ? "" : q.toLowerCase()) + "%";
            Predicate byFirst = cb.like(cb.lower(root.get("firstName")), pattern);
            Predicate byLast  = cb.like(cb.lower(root.get("lastName")), pattern);
            Predicate byEmail = cb.like(cb.lower(root.get("email")), pattern);
            return cb.or(byFirst, byLast, byEmail);
        };

        return customerRepo.findAll(spec)
            .stream()
            .map(cu -> new CustomerSearchResponse(
                cu.getId(),
                cu.getFirstName(),
                cu.getLastName(),
                cu.getEmail(),
                cu.getPhone()
            ))
            .collect(Collectors.toList());
    }

    /* ------------------ Yardımcı ------------------ */

    private CustomerResponse mapToResponse(Customer c) {
        // Entity: CustomerStatus → DTO: entity.Status
        Status dtoStatus = (c.getStatus() == null) ? null : Status.valueOf(c.getStatus().name());

        return new CustomerResponse(
            c.getId(),
            c.getTcNumber(),
            c.getFirstName(),
            c.getLastName(),
            c.getBirthDate(),
            c.getPhone(),
            c.getEmail(),
            c.getAddress(),
            c.getCity(),
            dtoStatus,
            c.getNotes(),
            c.getRegistrationDate(),
            c.getRiskProfile(),
            c.getCustomerValue()
        );
    }

    private static LocalDateTime toLocalDateTime(OffsetDateTime odt) {
        return (odt == null) ? null : odt.toLocalDateTime();
    }
}
