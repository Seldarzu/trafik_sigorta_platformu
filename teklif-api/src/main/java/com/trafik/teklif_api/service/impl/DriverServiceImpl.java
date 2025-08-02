// src/main/java/com/trafik/teklif_api/service/impl/DriverServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.service.DriverService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepo;

    @Autowired
    public DriverServiceImpl(DriverRepository driverRepo) {
        this.driverRepo = driverRepo;
    }

    @Override
    public DriverResponse create(CreateDriverRequest req) {
        Driver d = new Driver();
        d.setFirstName(req.firstName());
        d.setLastName(req.lastName());
        d.setTcNumber(req.tcNumber());
        d.setBirthDate(req.birthDate());
        d.setLicenseDate(req.licenseDate());
        d.setGender(req.gender());
        d.setMaritalStatus(req.maritalStatus());
        d.setEducation(req.education());
        d.setProfession(req.profession());
        d.setHasAccidents(req.hasAccidents());
        d.setAccidentCount(req.accidentCount());
        d.setHasViolations(req.hasViolations());
        d.setViolationCount(req.violationCount());
        Driver saved = driverRepo.save(d);
        return new DriverResponse(
            saved.getId(),
            saved.getFirstName(),
            saved.getLastName(),
            saved.getTcNumber(),
            saved.getBirthDate(),
            saved.getLicenseDate(),
            saved.getGender(),
            saved.getMaritalStatus(),
            saved.getEducation(),
            saved.getProfession(),
            saved.getHasAccidents(),
            saved.getAccidentCount(),
            saved.getHasViolations(),
            saved.getViolationCount()
        );
    }
}
