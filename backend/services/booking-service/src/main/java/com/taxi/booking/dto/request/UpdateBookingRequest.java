package com.taxi.booking.dto.request;

import com.taxi.booking.enums.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for updating an existing booking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 200, message = "Customer name must not exceed 200 characters")
    private String customerName;

    private String customerEmail;

    @NotBlank(message = "Contact number is required")
    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    private String contactNumber;

    private String passengerName;
    private Integer numberOfPassengers;

    private Integer corporateId;
    private String voucherNumber;
    private String costCenter;

    private String hireType;

    @NotNull(message = "Vehicle class is required")
    private Integer vehicleClassId;

    private Integer fareSchemeId;
    private PaymentType paymentType;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;

    private String dropAddress;
    private BigDecimal dropLatitude;
    private BigDecimal dropLongitude;

    private String destination;
    private BigDecimal estimatedDistance;

    private LocalDateTime pickupTime;
    private LocalDateTime scheduledTime;

    private Boolean isAdvanceBooking;
    private Boolean isTestBooking;
    private Boolean isInquiryOnly;

    private BigDecimal luggage;
    private String specialRemarks;
    private String clientRemarks;
    private String remarks;
    private BigDecimal percentage;
    private Boolean sendClientSms;

    private Integer promoCodeId;
}