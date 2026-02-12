package com.taxi.corporate.dto.request;

import com.taxi.corporate.enums.BillingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateCorporateRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    @NotBlank(message = "Company code is required")
    private String code;

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
}