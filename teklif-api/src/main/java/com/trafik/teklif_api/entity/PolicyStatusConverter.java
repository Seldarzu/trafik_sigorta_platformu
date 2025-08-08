package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.PolicyStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class PolicyStatusConverter implements AttributeConverter<PolicyStatus, String> {
    @Override
    public String convertToDatabaseColumn(PolicyStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public PolicyStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : PolicyStatus.valueOf(dbData.toUpperCase(Locale.ROOT));
    }
}
