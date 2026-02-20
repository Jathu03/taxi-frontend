package com.taxi.farepromo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum PromoApplicableTo {
    @JsonProperty("ALL")
    ALL,
    @JsonProperty("APP")
    APP,
    @JsonProperty("WEB")
    WEB,
    @JsonProperty("CORPORATE")
    CORPORATE;

    @JsonCreator
    public static PromoApplicableTo fromString(String value) {
        if (value == null)
            return null;
        try {
            return PromoApplicableTo.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}