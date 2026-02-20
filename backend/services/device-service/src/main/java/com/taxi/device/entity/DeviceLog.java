package com.taxi.device.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_logs", indexes = {
        @Index(name = "idx_device_logs_device", columnList = "device_id"),
        @Index(name = "idx_device_logs_type", columnList = "logType"),
        @Index(name = "idx_device_logs_created", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "log_type", nullable = false, length = 30)
    private String logType;

    @Column(name = "old_status", length = 20)
    private String oldStatus;

    @Column(name = "new_status", length = 20)
    private String newStatus;

    @Column(name = "old_vehicle_id")
    private Integer oldVehicleId;

    @Column(name = "new_vehicle_id")
    private Integer newVehicleId;

    @Column(name = "old_driver_id")
    private Integer oldDriverId;

    @Column(name = "new_driver_id")
    private Integer newDriverId;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "logged_by")
    private Integer loggedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}