package com.taxi.farepromo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum DiscountType {
    @JsonProperty("PERCENTAGE")
    PERCENTAGE,
    @JsonProperty("FIXED")
    FIXED;

    @JsonCreator
    public static DiscountType fromString(String value) {
        if (value == null)
            return null;
        try {
            return DiscountType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}