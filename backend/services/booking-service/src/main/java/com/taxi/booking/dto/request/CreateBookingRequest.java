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
 * DTO for creating a new booking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    // Customer Information
    @NotBlank(message = "Customer name is required")
    @Size(max = 200, message = "Customer name must not exceed 200 characters")
    private String customerName;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @Size(max = 200, message = "Customer email must not exceed 200 characters")
    private String customerEmail;

    @NotBlank(message = "Contact number is required")
    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    private String contactNumber;

    @Size(max = 200, message = "Passenger name must not exceed 200 characters")
    private String passengerName;

    private Integer numberOfPassengers = 1;

    // Corporate Information
    private Integer corporateId;
    private String voucherNumber;
    private String costCenter;

    // Hire Details
    private String hireType;

    @NotNull(message = "Vehicle class is required")
    private Integer vehicleClassId;

    private Integer fareSchemeId;

    private PaymentType paymentType;

    // Location Information
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;

    private String dropAddress;
    private BigDecimal dropLatitude;
    private BigDecimal dropLongitude;

    private String destination;
    private BigDecimal estimatedDistance;

    // Timing
    private LocalDateTime pickupTime;
    private LocalDateTime scheduledTime;

    // Flags
    private Boolean isAdvanceBooking = false;
    private Boolean isTestBooking = false;
    private Boolean isInquiryOnly = false;

    // Additional Information
    private BigDecimal luggage;
    private String specialRemarks;
    private String clientRemarks;
    private String remarks;
    private BigDecimal percentage;
    private Boolean sendClientSms = true;

    // Agent Information
    private Integer bookedBy;
    private String appPlatform;
    private String bookingSource;

    // Promo Code
    private Integer promoCodeId;
}