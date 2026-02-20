package com.taxi.corporate.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCorporateUserRequest {
    private String designation;
    private String department;
    private Boolean canBook;
    private Boolean canViewReports;
    private Boolean isActive;
}