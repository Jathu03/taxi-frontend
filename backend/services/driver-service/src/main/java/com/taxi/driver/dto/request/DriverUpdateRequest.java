package com.taxi.driver.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverUpdateRequest {

    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Size(max = 20, message = "NIC must not exceed 20 characters")
    private String nic;

    private LocalDate birthDate;

    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    private String contactNumber;

    @Size(max = 20, message = "Emergency number must not exceed 20 characters")
    private String emergencyNumber;

    private String address;

    @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
    private String profileImageUrl;

    private Boolean manualDispatchOnly;

    private Boolean isVerified;

    private Boolean isActive;

    @Size(max = 50, message = "License number must not exceed 50 characters")
    private String licenseNumber;

    private LocalDate licenseExpiryDate;

    @Size(max = 500, message = "License image URL must not exceed 500 characters")
    private String licenseImageUrl;

    private Integer vehicleId;

    private Integer userId;

    private Integer companyId;

    @Size(max = 20, message = "App version must not exceed 20 characters")
    private String appVersion;

    @Size(max = 255, message = "Device token must not exceed 255 characters")
    private String deviceToken;
}