package com.trafik.teklif_api.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class CustomerValueConverter implements AttributeConverter<CustomerValue, String> {
    @Override
    public String convertToDatabaseColumn(CustomerValue attribute) {
        return attribute == null ? null : attribute.name(); 
    }

    @Override
    public CustomerValue convertToEntityAttribute(String dbData) {
        return dbData == null ? null : CustomerValue.valueOf(dbData.toUpperCase());
    }
}
