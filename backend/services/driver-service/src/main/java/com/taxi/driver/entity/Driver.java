package com.taxi.driver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing a Driver
 * Maps to 'drivers' table in database
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(length = 20)
    private String nic;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "emergency_number", length = 20)
    private String emergencyNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "is_blocked", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isBlocked = false;

    @Column(name = "blocked_description", columnDefinition = "TEXT")
    private String blockedDescription;

    @Column(name = "manual_dispatch_only", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean manualDispatchOnly = false;

    @Column(name = "is_verified", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isVerified = false;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive = true;

    @Column(name = "license_number", length = 50)
    private String licenseNumber;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "license_image_url", length = 500)
    private String licenseImageUrl;

    // Foreign key to vehicles table (managed by Vehicle Service)
    @Column(name = "vehicle_id")
    private Integer vehicleId;

    // Foreign key to users table (managed by User Service)
    @Column(name = "user_id")
    private Integer userId;

    // Foreign key to companies table (managed by Vehicle Service)
    @Column(name = "company_id")
    private Integer companyId;

    @Column(name = "app_version", length = 20)
    private String appVersion;

    @Column(name = "device_token", length = 255)
    private String deviceToken;

    @Column(name = "last_location", length = 255)
    private String lastLocation;

    @Column(name = "last_location_time")
    private LocalDateTime lastLocationTime;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = new BigDecimal("5.00");

    @Column(name = "rating_count", columnDefinition = "INT DEFAULT 0")
    private Integer ratingCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}