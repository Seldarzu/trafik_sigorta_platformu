package com.trafik.teklif_api.config.converter;

import com.trafik.teklif_api.model.enums.PolicyStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PolicyStatusConverter implements AttributeConverter<PolicyStatus, String> {

    @Override
    public String convertToDatabaseColumn(PolicyStatus attribute) {
        return attribute == null ? null : attribute.name(); // DB'ye UPPERCASE yaz
    }

    @Override
    public PolicyStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return PolicyStatus.valueOf(dbData.trim().toUpperCase()); // küçük harfi tolere et
    }
}
