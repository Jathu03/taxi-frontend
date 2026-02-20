package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleMakeResponse {
    private Integer id;
    private String manufacturer;
    private String manufacturerCode;
}