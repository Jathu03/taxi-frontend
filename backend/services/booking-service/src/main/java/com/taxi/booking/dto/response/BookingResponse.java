package com.taxi.booking.dto.response;

import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for Booking response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Integer id;
    private String bookingId;
    private String voucherNumber;
    private String costCenter;

    // Customer Information
    private String customerName;
    private String customerEmail;
    private String contactNumber;
    private String passengerName;
    private Integer numberOfPassengers;

    // Corporate Information
    private Integer corporateId;
    private String corporateName;
    private String corporateCode;

    // Hire Details
    private String hireType;

    // Vehicle Class Information (from Vehicle Service)
    private Integer vehicleClassId;
    private String vehicleClassName;
    private String vehicleClassCode;

    // Fare Scheme Information (from Fare Service)
    private Integer fareSchemeId;
    private String fareSchemeName;
    private String fareSchemeCode;

    private PaymentType paymentType;

    // Location Information
    private String pickupAddress;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private String dropAddress;
    private BigDecimal dropLatitude;
    private BigDecimal dropLongitude;
    private String destination;
    private BigDecimal estimatedDistance;

    // Timing
    private LocalDateTime bookingTime;
    private LocalDateTime pickupTime;
    private LocalDateTime scheduledTime;

    // Flags
    private Boolean isAdvanceBooking;
    private Boolean isTestBooking;
    private Boolean isInquiryOnly;

    // Assignment
    private Integer driverId;
    private String driverCode;
    private String driverName;
    private String driverPhone;

    private Integer vehicleId;
    private String vehicleCode;
    private String vehicleRegistrationNumber;

    // Dispatch Information
    private LocalDateTime dispatchedTime;
    private Integer dispatchedBy;
    private String dispatchedByName;

    // Trip Progress
    private LocalDateTime driverAcceptedTime;
    private LocalDateTime driverArrivedTime;
    private LocalDateTime startTime;
    private LocalDateTime completedTime;

    // Location Tracking
    private String currentLocation;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private String eta;

    // Completion Details
    private BigDecimal startOdometer;
    private BigDecimal endOdometer;
    private BigDecimal totalDistance;
    private Integer totalWaitTime;
    private Integer billedWaitTime;
    private BigDecimal totalWaitingFee;

    // Fare Breakdown
    private BigDecimal baseFare;
    private BigDecimal distanceFare;
    private BigDecimal timeFare;
    private BigDecimal surgeFee;
    private BigDecimal discountAmount;

    // Promo Code Information
    private Integer promoCodeId;
    private String promoCode;

    private BigDecimal totalFare;

    // Additional Information
    private BigDecimal luggage;
    private String specialRemarks;
    private String clientRemarks;
    private String remarks;
    private BigDecimal percentage;
    private Boolean sendClientSms;

    // Status
    private BookingStatus status;

    // Agent Information
    private Integer bookedBy;
    private String bookedByName;
    private String appPlatform;
    private String bookingSource;

    // Ratings
    private Integer customerRating;
    private String customerFeedback;
    private Integer driverRating;
    private String driverFeedback;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}