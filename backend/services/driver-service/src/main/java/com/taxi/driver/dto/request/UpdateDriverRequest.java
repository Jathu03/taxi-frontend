package com.taxi.driver.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for updating an existing driver
 * Contains fields that can be updated
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDriverRequest {

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

    private Boolean isBlocked;

    private String blockedDescription;

    private Boolean manualDispatchOnly;

    private Boolean isVerified;

    private Boolean isActive;

    @Size(max = 50, message = "License number must not exceed 50 characters")
    private String licenseNumber;

    private LocalDate licenseExpiryDate;

    private Integer vehicleId;

    private Integer userId;

    @NotNull(message = "Company is required")
    private Integer companyId;
}