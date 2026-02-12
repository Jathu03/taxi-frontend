package com.taxi.vehicle.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enum for turbo types
 */
public enum TurboType {
    @JsonProperty("NONE")
    NONE,
    @JsonProperty("SINGLE_TURBO")
    SINGLE_TURBO,
    @JsonProperty("TWIN_TURBO")
    TWIN_TURBO,
    @JsonProperty("SEQUENTIAL_TURBO")
    SEQUENTIAL_TURBO,
    @JsonProperty("ELECTRIC_TURBO")
    ELECTRIC_TURBO;

    @JsonCreator
    public static TurboType fromString(String value) {
        if (value == null)
            return null;
        try {
            return TurboType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}