package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Integer id;
    private String code;
    private String firstName;
    private String lastName;
    private String fullName;
    private String nic;
    private LocalDate birthDate;
    private String contactNumber;
    private String emergencyNumber;
    private String address;
    private String profileImageUrl;
    private Boolean isBlocked;
    private String blockedDescription;
    private Boolean manualDispatchOnly;
    private Boolean isVerified;
    private Boolean isActive;
    private String licenseNumber;
    private LocalDate licenseExpiryDate;
    private String licenseImageUrl;
    private Integer vehicleId;
    private Integer userId;
    private Integer companyId;
    private String appVersion;
    private String lastLocation;
    private LocalDateTime lastLocationTime;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}