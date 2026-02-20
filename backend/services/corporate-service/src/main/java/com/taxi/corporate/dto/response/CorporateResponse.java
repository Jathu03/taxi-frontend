package com.taxi.corporate.dto.response;

import com.taxi.corporate.enums.BillingType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CorporateResponse {
    private Integer id;
    private String name;
    private String code;
    private String primaryContact;
    private String phone;
    private String email;
    private String address;
    private LocalDate registrationDate;
    private BillingType billingType;
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private BigDecimal cashDiscountRate;
    private BigDecimal creditDiscountRate;
    private Boolean enableQuickBooking;
    private Boolean requireVoucher;
    private Boolean requireCostCenter;
    private Boolean isActive;
    private List<CorporateVehicleClassResponse> vehicleClasses;
    private List<CorporateVehicleCategoryResponse> vehicleCategories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}