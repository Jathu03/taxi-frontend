package com.taxi.driver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drivers", indexes = {
        @Index(name = "idx_drivers_code", columnList = "code"),
        @Index(name = "idx_drivers_contact", columnList = "contact_number"),
        @Index(name = "idx_drivers_blocked", columnList = "is_blocked"),
        @Index(name = "idx_drivers_active", columnList = "is_active"),
        @Index(name = "idx_drivers_vehicle", columnList = "vehicle_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "nic", length = 20)
    private String nic;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "emergency_number", length = 20)
    private String emergencyNumber;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "is_blocked")
    @Builder.Default
    private Boolean isBlocked = false;

    @Column(name = "blocked_description", columnDefinition = "TEXT")
    private String blockedDescription;

    @Column(name = "manual_dispatch_only")
    @Builder.Default
    private Boolean manualDispatchOnly = false;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "license_number", length = 50)
    private String licenseNumber;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "license_image_url", length = 500)
    private String licenseImageUrl;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "user_id")
    private Integer userId;

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
    @Builder.Default
    private BigDecimal averageRating = new BigDecimal("5.00");

    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<DriverActivityLog> activityLogs = new ArrayList<>();
}