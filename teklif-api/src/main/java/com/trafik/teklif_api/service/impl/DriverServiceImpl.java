package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {
    private final DriverRepository repo;

    @Override
    public DriverResponse create(CreateDriverRequest req) {
        Driver d = new Driver();
        BeanUtils.copyProperties(req, d);
        d = repo.save(d);
        return new DriverResponse(d.getId(), d.getFirstName(), d.getLastName(), d.getLicenseNumber());
    }
}
