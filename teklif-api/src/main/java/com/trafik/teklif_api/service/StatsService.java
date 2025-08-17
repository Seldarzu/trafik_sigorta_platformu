package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.stats.ConversionResponse;
import com.trafik.teklif_api.dto.stats.CountResponse;

public interface StatsService {
    CountResponse quotes();
    CountResponse policies();
    CountResponse customers();
    ConversionResponse conversion();
}
