package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.external.CityDto;
import com.trafik.teklif_api.dto.external.ProfessionDto;
import com.trafik.teklif_api.dto.external.SendEmailRequest;
import com.trafik.teklif_api.dto.external.SendSmsRequest;
import com.trafik.teklif_api.service.ExternalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ExternalServiceImpl implements ExternalService {

    @Override
    public void sendSms(SendSmsRequest req) {
        // Mock entegrasyon
        log.info("[SMS] to={}, message={}", req.to(), req.message());
    }

    @Override
    public void sendEmail(SendEmailRequest req) {
        // Mock entegrasyon
        log.info("[EMAIL] to={}, subject={}, body.len={}",
                req.to(), req.subject(), req.body() == null ? 0 : req.body().length());
    }

    @Override
    public List<CityDto> getCities() {
        return List.of(
            new CityDto(34, "İstanbul"),
            new CityDto(6, "Ankara"),
            new CityDto(35, "İzmir"),
            new CityDto(16, "Bursa"),
            new CityDto(1, "Adana")
        );
    }

    @Override
    public List<ProfessionDto> getProfessions() {
        return List.of(
            new ProfessionDto("Software Engineer"),
            new ProfessionDto("Teacher"),
            new ProfessionDto("Doctor"),
            new ProfessionDto("Driver"),
            new ProfessionDto("Lawyer")
        );
    }
}
