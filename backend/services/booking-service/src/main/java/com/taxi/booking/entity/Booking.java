package com.taxi.booking.entity;

import com.taxi.booking.enums.BookingSource;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.enums.HireType;
import com.taxi.booking.enums.PaymentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a Booking
 * Maps to 'bookings' table in database
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "booking_id", nullable = false, unique = true, length = 20)
    private String bookingId;

    @Column(name = "voucher_number", length = 50)
    private String voucherNumber;

    @Column(name = "cost_center", length = 100)
    private String costCenter;

    // Customer info (simple fields - NO customer table reference)
    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_email", length = 200)
    private String customerEmail;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "passenger_name", length = 200)
    private String passengerName;

    @Column(name = "number_of_passengers", columnDefinition = "INT DEFAULT 1")
    private Integer numberOfPassengers = 1;

    // Corporate reference (Foreign key to corporates table - managed by Corporate
    // Service)
    @Column(name = "corporate_id")
    private Integer corporateId;

    // Hire details
    @Column(name = "hire_type", length = 50)
    private String hireType;

    // Foreign key to vehicle_classes table (managed by Vehicle Service)
    @Column(name = "vehicle_class_id")
    private Integer vehicleClassId;

    // Foreign key to fare_schemes table (managed by Fare Service)
    @Column(name = "fare_scheme_id")
    private Integer fareSchemeId;

    @Column(name = "payment_type", length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    // Location info
    @Column(name = "pickup_address", columnDefinition = "TEXT", nullable = false)
    private String pickupAddress;

    @Column(name = "pickup_latitude", precision = 10, scale = 8)
    private BigDecimal pickupLatitude;

    @Column(name = "pickup_longitude", precision = 11, scale = 8)
    private BigDecimal pickupLongitude;

    @Column(name = "drop_address", columnDefinition = "TEXT")
    private String dropAddress;

    @Column(name = "drop_latitude", precision = 10, scale = 8)
    private BigDecimal dropLatitude;

    @Column(name = "drop_longitude", precision = 11, scale = 8)
    private BigDecimal dropLongitude;

    @Column(length = 200)
    private String destination;

    @Column(name = "estimated_distance", precision = 8, scale = 2)
    private BigDecimal estimatedDistance;

    // Timing
    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime = LocalDateTime.now();

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime;

    // Flags
    @Column(name = "is_advance_booking", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isAdvanceBooking = false;

    @Column(name = "is_test_booking", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isTestBooking = false;

    @Column(name = "is_inquiry_only", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isInquiryOnly = false;

    // Assignment (Foreign keys to drivers/vehicles tables - managed by
    // Driver/Vehicle Service)
    @Column(name = "driver_id")
    private Integer driverId;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    // Dispatch info
    @Column(name = "dispatched_time")
    private LocalDateTime dispatchedTime;

    // Foreign key to users table (managed by User Service)
    @Column(name = "dispatched_by")
    private Integer dispatchedBy;

    // Trip progress
    @Column(name = "driver_accepted_time")
    private LocalDateTime driverAcceptedTime;

    @Column(name = "driver_arrived_time")
    private LocalDateTime driverArrivedTime;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    // Location tracking
    @Column(name = "current_location", length = 255)
    private String currentLocation;

    @Column(name = "current_latitude", precision = 10, scale = 8)
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude", precision = 11, scale = 8)
    private BigDecimal currentLongitude;

    @Column(length = 50)
    private String eta;

    // Completion details
    @Column(name = "start_odometer", precision = 10, scale = 2)
    private BigDecimal startOdometer;

    @Column(name = "end_odometer", precision = 10, scale = 2)
    private BigDecimal endOdometer;

    @Column(name = "total_distance", precision = 8, scale = 2)
    private BigDecimal totalDistance;

    @Column(name = "total_wait_time")
    private Integer totalWaitTime;

    @Column(name = "billed_wait_time")
    private Integer billedWaitTime;

    @Column(name = "total_waiting_fee", precision = 10, scale = 2)
    private BigDecimal totalWaitingFee;

    // Fare breakdown
    @Column(name = "base_fare", precision = 10, scale = 2)
    private BigDecimal baseFare;

    @Column(name = "distance_fare", precision = 10, scale = 2)
    private BigDecimal distanceFare;

    @Column(name = "time_fare", precision = 10, scale = 2)
    private BigDecimal timeFare;

    @Column(name = "surge_fee", precision = 10, scale = 2)
    private BigDecimal surgeFee;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    // Foreign key to promo_codes table (managed by Promo Service)
    @Column(name = "promo_code_id")
    private Integer promoCodeId;

    @Column(name = "total_fare", precision = 10, scale = 2)
    private BigDecimal totalFare;

    // Additional info
    @Column(precision = 4, scale = 2)
    private BigDecimal luggage;

    @Column(name = "special_remarks", columnDefinition = "TEXT")
    private String specialRemarks;

    @Column(name = "client_remarks", columnDefinition = "TEXT")
    private String clientRemarks;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "send_client_sms", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean sendClientSms = true;

    // Status
    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    // Agent tracking (Foreign key to users table - managed by User Service)
    @Column(name = "booked_by")
    private Integer bookedBy;

    @Column(name = "app_platform", length = 20)
    private String appPlatform;

    @Column(name = "booking_source", length = 20)
    @Enumerated(EnumType.STRING)
    private BookingSource bookingSource = BookingSource.CALL_CENTER;

    // Ratings
    @Column(name = "customer_rating")
    private Integer customerRating;

    @Column(name = "customer_feedback", columnDefinition = "TEXT")
    private String customerFeedback;

    @Column(name = "driver_rating")
    private Integer driverRating;

    @Column(name = "driver_feedback", columnDefinition = "TEXT")
    private String driverFeedback;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}