package com.taxi.vehicle.config;

import jakarta.persistence.AttributeConverter;
import java.util.function.Function;

/**
 * Abstract class for case-insensitive Enum mapping in JPA
 */
public abstract class EnumCaseInsensitiveConverter<E extends Enum<E>> implements AttributeConverter<E, String> {

    private final Class<E> enumClass;

    protected EnumCaseInsensitiveConverter(Class<E> enumClass) {
        this.enumClass = enumClass;
    }

    @Override
    public String convertToDatabaseColumn(E attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public E convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return Enum.valueOf(enumClass, dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
