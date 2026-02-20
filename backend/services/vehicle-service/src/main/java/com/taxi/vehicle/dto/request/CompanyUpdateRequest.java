package com.taxi.vehicle.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyUpdateRequest {

    @Size(max = 200, message = "Company name must not exceed 200 characters")
    private String companyName;

    @Size(max = 20, message = "Company code must not exceed 20 characters")
    private String companyCode;

    private Boolean isActive;
}