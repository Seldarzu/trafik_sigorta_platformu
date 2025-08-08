package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.QuoteStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class QuoteStatusConverter implements AttributeConverter<QuoteStatus, String> {
    @Override
    public String convertToDatabaseColumn(QuoteStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public QuoteStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : QuoteStatus.valueOf(dbData.toUpperCase());
    }
}
