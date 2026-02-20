package com.taxi.vehicle.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVehicleOwnerRequest {

    @NotBlank(message = "Owner name is required")
    @Size(max = 200, message = "Owner name must not exceed 200 characters")
    private String name;

    @Size(max = 50, message = "NIC/Business registration must not exceed 50 characters")
    private String nicOrBusinessReg;

    @Size(max = 200, message = "Company name must not exceed 200 characters")
    private String company;

    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Primary contact is required")
    @Size(max = 20, message = "Primary contact must not exceed 20 characters")
    private String primaryContact;

    @Size(max = 20, message = "Secondary contact must not exceed 20 characters")
    private String secondaryContact;

    private String postalAddress;

    private Boolean isActive;
}