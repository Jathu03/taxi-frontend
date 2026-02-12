package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Driver response
 * Contains driver information to be sent to client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Integer id;
    private String code;
    private String firstName;
    private String lastName;
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

    // Vehicle information (from Vehicle Service)
    private Integer vehicleId;
    private String vehicleCode;
    private String vehicleRegistrationNumber;

    // User information (from User Service)
    private Integer userId;
    private String username;

    // Company information (from Vehicle Service)
    private Integer companyId;
    private String companyName;

    private String appVersion;
    private String deviceToken;
    private String lastLocation;
    private LocalDateTime lastLocationTime;

    private BigDecimal averageRating;
    private Integer ratingCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}