package com.taxi.corporate.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CorporateVehicleClassResponse {
    private Integer id;
    private Integer vehicleClassId;
    private String className;
    private String classCode;
    private Boolean isEnabled;
    private BigDecimal customRate;
}