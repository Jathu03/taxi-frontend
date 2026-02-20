package com.taxi.driver.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class DriverCreateRequest {

    @NotBlank(message = "Driver code is required")
    @Size(max = 50, message = "Driver code must not exceed 50 characters")
    private String code;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Size(max = 20, message = "NIC must not exceed 20 characters")
    private String nic;

    private LocalDate birthDate;

    @NotBlank(message = "Contact number is required")
    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    private String contactNumber;

    @Size(max = 20, message = "Emergency number must not exceed 20 characters")
    private String emergencyNumber;

    private String address;

    @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
    private String profileImageUrl;

    private Boolean manualDispatchOnly;

    @Size(max = 50, message = "License number must not exceed 50 characters")
    private String licenseNumber;

    private LocalDate licenseExpiryDate;

    @Size(max = 500, message = "License image URL must not exceed 500 characters")
    private String licenseImageUrl;

    private Integer vehicleId;

    private Integer userId;

    private Integer companyId;
}