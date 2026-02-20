package com.taxi.corporate.dto.request;

import lombok.Data;

@Data
public class AssignCorporateUserRequest {

    private Integer userId;
    private String designation;
    private String department;
    private Boolean canBook;
    private Boolean canViewReports;
    private String costCenter;
}