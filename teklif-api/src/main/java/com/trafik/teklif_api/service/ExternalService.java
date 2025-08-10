package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.external.CityDto;
import com.trafik.teklif_api.dto.external.ProfessionDto;
import com.trafik.teklif_api.dto.external.SendEmailRequest;
import com.trafik.teklif_api.dto.external.SendSmsRequest;

import java.util.List;

public interface ExternalService {
    void sendSms(SendSmsRequest req);
    void sendEmail(SendEmailRequest req);
    List<CityDto> getCities();
    List<ProfessionDto> getProfessions();
}
