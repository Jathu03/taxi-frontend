package com.taxi.corporate.dto.request;

import com.taxi.corporate.enums.BillingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateCorporateRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String primaryContact;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String address;
    private LocalDate registrationDate;
    private BillingType billingType;
    private BigDecimal creditLimit;
    private BigDecimal cashDiscountRate;
    private BigDecimal creditDiscountRate;
    private Boolean enableQuickBooking;
    private Boolean requireVoucher;
    private Boolean requireCostCenter;
    private Boolean isActive;

    private List<Integer> vehicleClassIds;
    private List<Integer> vehicleCategoryIds;
}