package com.taxi.corporate.dto.response;

import lombok.Data;

@Data
public class RoleResponse {
    private Integer id;
    private String roleName;
    private String description;
    private Boolean isActive;
}