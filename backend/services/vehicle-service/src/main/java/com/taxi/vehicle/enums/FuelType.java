package com.taxi.vehicle.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enum for vehicle fuel types
 */
public enum FuelType {
    @JsonProperty("PETROL")
    PETROL,
    @JsonProperty("DIESEL")
    DIESEL,
    @JsonProperty("HYBRID")
    HYBRID,
    @JsonProperty("ELECTRIC")
    ELECTRIC,
    @JsonProperty("CNG")
    CNG,
    @JsonProperty("LPG")
    LPG;

    @JsonCreator
    public static FuelType fromString(String value) {
        if (value == null)
            return null;
        try {
            return FuelType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}