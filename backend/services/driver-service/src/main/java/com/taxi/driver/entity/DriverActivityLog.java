package com.taxi.driver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_activity_logs", indexes = {
        @Index(name = "idx_driver_activity_driver", columnList = "driver_id"),
        @Index(name = "idx_driver_activity_date", columnList = "log_date"),
        @Index(name = "idx_driver_activity_type", columnList = "activity_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "activity_type", nullable = false, length = 30)
    private String activityType;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "vehicle_code", length = 50)
    private String vehicleCode;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
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
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}