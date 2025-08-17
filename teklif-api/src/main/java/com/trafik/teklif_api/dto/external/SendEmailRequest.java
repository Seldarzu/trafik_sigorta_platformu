package com.trafik.teklif_api.dto.external;

public record SendEmailRequest(String to, String subject, String body) {}
