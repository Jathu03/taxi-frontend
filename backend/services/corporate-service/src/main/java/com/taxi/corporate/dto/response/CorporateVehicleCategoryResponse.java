package com.taxi.corporate.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CorporateVehicleCategoryResponse {
    private Integer id;
    private Integer vehicleCategoryId;
    private String categoryName;
    private Boolean isEnabled;
}