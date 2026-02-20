package com.taxi.vehicle.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enum for vehicle transmission types
 */
public enum TransmissionType {
    @JsonProperty("MANUAL")
    MANUAL,
    @JsonProperty("AUTOMATIC")
    AUTOMATIC,
    @JsonProperty("SEMI_AUTOMATIC")
    SEMI_AUTOMATIC,
    @JsonProperty("CVT")
    CVT;

    @JsonCreator
    public static TransmissionType fromString(String value) {
        if (value == null)
            return null;
        try {
            return TransmissionType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}