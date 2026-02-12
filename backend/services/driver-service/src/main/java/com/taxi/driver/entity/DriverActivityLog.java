package com.taxi.driver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing a Driver Activity Log
 * Maps to 'driver_activity_logs' table in database
 * Tracks driver online/offline status and location
 */
@Entity
@Table(name = "driver_activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "activity_type", nullable = false, length = 30)
    private String activityType;

    // Foreign key to vehicles table (managed by Vehicle Service)
    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "vehicle_code", length = 50)
    private String vehicleCode;

    @Column(length = 255)
    private String location;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "online_time")
    private LocalDateTime onlineTime;

    @Column(name = "offline_time")
    private LocalDateTime offlineTime;

    @Column(name = "total_online_duration")
    private Integer totalOnlineDuration;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}