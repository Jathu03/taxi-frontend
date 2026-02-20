package com.taxi.farepromo.entity;

import com.taxi.farepromo.enums.FareSchemeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "fare_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FareScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fare_code", nullable = false, unique = true, length = 50)
    private String fareCode;

    @Column(name = "fare_name", length = 100)
    private String fareName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "vehicle_class_id")
    private Integer vehicleClassId;

    @Column(name = "is_metered", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isMetered;

    @Column(name = "is_package", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isPackage;

    @Column(name = "minimum_distance", precision = 6, scale = 2)
    private BigDecimal minimumDistance;

    @Column(name = "minimum_rate", precision = 10, scale = 2)
    private BigDecimal minimumRate;

    @Column(name = "rate_per_km", precision = 8, scale = 2)
    private BigDecimal ratePerKm;

    @Column(name = "free_wait_time")
    private Integer freeWaitTime;

    @Column(name = "waiting_charge_per_min", precision = 6, scale = 2)
    private BigDecimal waitingChargePerMin;

    @Column(name = "peak_hour_start_time")
    private LocalTime peakHourStartTime;

    @Column(name = "peak_hour_end_time")
    private LocalTime peakHourEndTime;

    @Column(name = "peak_hour_rate_hike", precision = 8, scale = 2)
    private BigDecimal peakHourRateHike;

    @Column(name = "off_peak_min_rate_hike", precision = 8, scale = 2)
    private BigDecimal offPeakMinRateHike;

    @Column(name = "rate_per_km_hike", precision = 8, scale = 2)
    private BigDecimal ratePerKmHike;

    @Column(name = "minimum_time")
    private Integer minimumTime;

    @Column(name = "additional_time_slot")
    private Integer additionalTimeSlot;

    @Column(name = "rate_per_additional_time_slot", precision = 8, scale = 2)
    private BigDecimal ratePerAdditionalTimeSlot;

    @Column(name = "night_start_time")
    private LocalTime nightStartTime;

    @Column(name = "night_end_time")
    private LocalTime nightEndTime;

    @Column(name = "night_rate_hike", precision = 8, scale = 2)
    private BigDecimal nightRateHike;

    @Column(name = "status", length = 20)
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (status == null)
            status = "Active";
        if (isMetered == null)
            isMetered = true;
        if (isPackage == null)
            isPackage = false;
    }
}