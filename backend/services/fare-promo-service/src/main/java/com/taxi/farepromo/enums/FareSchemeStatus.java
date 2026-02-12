package com.taxi.farepromo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum FareSchemeStatus {
    @JsonProperty("Active")
    ACTIVE("Active"),
    @JsonProperty("Inactive")
    INACTIVE("Inactive"),
    @JsonProperty("Draft")
    DRAFT("Draft");

    private final String value;

    FareSchemeStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @JsonCreator
    public static FareSchemeStatus fromString(String value) {
        if (value == null)
            return null;
        for (FareSchemeStatus status : values()) {
            if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return null;
    }
}