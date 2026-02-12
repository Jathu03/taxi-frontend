package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleClassResponse {
    private Integer id;
    private String className;
    private String classCode;
    private BigDecimal commissionRate;
    private Integer noOfSeats;
}