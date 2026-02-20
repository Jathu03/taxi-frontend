package com.taxi.driver.dto.external;

import lombok.Data;

@Data
public class VehicleResponse {
    private Integer id;
    private String registrationNumber;
    private Integer classId;
    private Boolean isActive;
}
