package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {
    private Integer id;
    private String code;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private Boolean isBlocked;
    private Boolean isActive;
}