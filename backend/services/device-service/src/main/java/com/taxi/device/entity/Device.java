package com.taxi.device.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devices", indexes = {
        @Index(name = "idx_devices_device_id", columnList = "deviceId"),
        @Index(name = "idx_devices_type", columnList = "deviceType"),
        @Index(name = "idx_devices_status", columnList = "status"),
        @Index(name = "idx_devices_vehicle", columnList = "vehicle_id"),
        @Index(name = "idx_devices_driver", columnList = "driver_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "device_id", nullable = false, unique = true, length = 50)
    private String deviceId;

    @Column(name = "device_type", nullable = false, length = 30)
    private String deviceType;

    @Column(name = "device_model", length = 100)
    private String deviceModel;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "sim_number", length = 20)
    private String simNumber;

    @Column(name = "sim_provider", length = 50)
    private String simProvider;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "driver_id")
    private Integer driverId;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "Active";

    @Column(name = "install_date")
    private LocalDate installDate;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @Column(name = "gps_provider", length = 100)
    private String gpsProvider;

    @Column(name = "gps_account_id", length = 100)
    private String gpsAccountId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DeviceLog> deviceLogs = new ArrayList<>();
}