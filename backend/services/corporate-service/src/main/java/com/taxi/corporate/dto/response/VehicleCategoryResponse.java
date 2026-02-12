package com.taxi.corporate.dto.response;

import lombok.Data;

@Data
public class VehicleCategoryResponse {
    private Integer id;
    private String categoryName;
    private String description;
    private Boolean isActive;
}