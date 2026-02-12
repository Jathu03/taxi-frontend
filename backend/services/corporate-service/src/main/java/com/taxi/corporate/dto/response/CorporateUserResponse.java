package com.taxi.corporate.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CorporateUserResponse {
    private Integer id;
    private Integer corporateId;
    private String corporateName;

    // User details fetched from User-Service
    private Integer userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    private String designation;
    private String department;
    private Boolean canBook;
    private Boolean canViewReports;
    private Boolean isActive;
    private LocalDateTime createdAt;
}