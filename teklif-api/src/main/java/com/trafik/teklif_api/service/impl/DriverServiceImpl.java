package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateDriverRequest;
import com.trafik.teklif_api.dto.DriverResponse;
import com.trafik.teklif_api.dto.LicenseInfoResponse;
import com.trafik.teklif_api.dto.TcValidationResponse;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.model.enums.Education;
import com.trafik.teklif_api.model.enums.Gender;
import com.trafik.teklif_api.model.enums.MaritalStatus;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class DriverServiceImpl implements DriverService {

  private final DriverRepository driverRepo;

  @Autowired
  public DriverServiceImpl(DriverRepository driverRepo) {
    this.driverRepo = driverRepo;
  }

  @Override
  @Transactional
  public DriverResponse create(CreateDriverRequest req) {
    // Aynı TC varsa getir, yoksa yeni oluştur (idempotent upsert)
    Driver d = driverRepo.findByTcNumber(req.tcNumber()).orElseGet(Driver::new);
    boolean isNew = (d.getId() == null);

    // Temel alanlar
    d.setFirstName(req.firstName());
    d.setLastName(req.lastName());
    d.setTcNumber(req.tcNumber());
    d.setBirthDate(req.birthDate());
    d.setLicenseDate(req.licenseDate());
    d.setProfession(req.profession());

    // String -> Enum (null/boş güvenli, UPPER)
    d.setGender(parseEnum(Gender.class, req.gender()));
    d.setMaritalStatus(parseEnum(MaritalStatus.class, req.maritalStatus()));
    d.setEducation(parseEnum(Education.class, req.education()));

    // Kaza/ihlal bilgileri (null geldiyse mevcut değeri koru; yeni kayıtsa varsayılan yaz)
    if (req.hasAccidents() != null) {
      d.setHasAccidents(req.hasAccidents());
    } else if (isNew) {
      d.setHasAccidents(false);
    }

    if (req.hasViolations() != null) {
      d.setHasViolations(req.hasViolations());
    } else if (isNew) {
      d.setHasViolations(false);
    }

    if (req.accidentCount() != null) {
      d.setAccidentCount(req.accidentCount());
    } else if (isNew) {
      d.setAccidentCount(0);
    }

    if (req.violationCount() != null) {
      d.setViolationCount(req.violationCount());
    } else if (isNew) {
      d.setViolationCount(0);
    }

    Driver saved = driverRepo.save(d);

    return new DriverResponse(
      saved.getId(),
      saved.getFirstName(),
      saved.getLastName(),
      saved.getTcNumber(),
      saved.getBirthDate(),
      saved.getLicenseDate(),
      saved.getGender() != null ? saved.getGender().name() : null,
      saved.getMaritalStatus() != null ? saved.getMaritalStatus().name() : null,
      saved.getEducation() != null ? saved.getEducation().name() : null,
      saved.getProfession(),
      saved.isHasAccidents(),
      saved.getAccidentCount(),
      saved.isHasViolations(),
      saved.getViolationCount()
    );
  }

  @Override
  public TcValidationResponse validateTc(String tcNumber) {
    boolean valid = tcNumber != null && tcNumber.matches("\\d{11}");
    return new TcValidationResponse(tcNumber, valid);
  }

  @Override
  public LicenseInfoResponse licenseInfo(String tcNumber) {
    Driver d = driverRepo.findByTcNumber(tcNumber)
      .orElseThrow(() -> new RuntimeException("Sürücü bulunamadı: " + tcNumber));
    return new LicenseInfoResponse(
      d.getTcNumber(),
      d.getFirstName(),
      d.getLastName(),
      d.getLicenseDate()
    );
  }

  private static <E extends Enum<E>> E parseEnum(Class<E> type, String val) {
    if (val == null) return null;
    String s = val.trim();
    if (s.isEmpty()) return null;
    return Enum.valueOf(type, s.toUpperCase(Locale.ROOT));
  }
}
