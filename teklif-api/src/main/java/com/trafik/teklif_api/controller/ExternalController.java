package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.external.CityDto;
import com.trafik.teklif_api.dto.external.ProfessionDto;
import com.trafik.teklif_api.dto.external.SendEmailRequest;
import com.trafik.teklif_api.dto.external.SendSmsRequest;
import com.trafik.teklif_api.service.ExternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/external")
@RequiredArgsConstructor
public class ExternalController {

    private final ExternalService externalService;

    @PostMapping("/sms/send")
    public void sendSms(@RequestBody SendSmsRequest req) {
        externalService.sendSms(req);
    }

    @PostMapping("/email/send")
    public void sendEmail(@RequestBody SendEmailRequest req) {
        externalService.sendEmail(req);
    }

    @GetMapping("/cities")
    public List<CityDto> getCities() {
        return externalService.getCities();
    }

    @GetMapping("/professions")
    public List<ProfessionDto> getProfessions() {
        return externalService.getProfessions();
    }
}
