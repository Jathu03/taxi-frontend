package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Company response from Vehicle Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {

    private Integer id;
    private String companyName;
    private String companyCode;
    private Boolean isActive;
}