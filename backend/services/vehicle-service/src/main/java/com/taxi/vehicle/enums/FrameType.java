package com.taxi.vehicle.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enum for vehicle frame types
 */
public enum FrameType {
    @JsonProperty("SEDAN")
    SEDAN,
    @JsonProperty("SUV")
    SUV,
    @JsonProperty("HATCHBACK")
    HATCHBACK,
    @JsonProperty("WAGON")
    WAGON,
    @JsonProperty("VAN")
    VAN,
    @JsonProperty("COUPE")
    COUPE,
    @JsonProperty("CONVERTIBLE")
    CONVERTIBLE,
    @JsonProperty("PICKUP")
    PICKUP,
    @JsonProperty("TRUCK")
    TRUCK,
    @JsonProperty("BUS")
    BUS,
    @JsonProperty("THREE_WHEELER")
    THREE_WHEELER;

    @JsonCreator
    public static FrameType fromString(String value) {
        if (value == null)
            return null;
        try {
            return FrameType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
