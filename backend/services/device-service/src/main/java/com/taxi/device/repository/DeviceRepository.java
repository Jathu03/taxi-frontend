package com.taxi.device.repository;

import com.taxi.device.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Integer>, JpaSpecificationExecutor<Device> {

    Optional<Device> findByDeviceId(String deviceId);

    boolean existsByDeviceId(String deviceId);

    List<Device> findByStatus(String status);

    Page<Device> findByStatus(String status, Pageable pageable);

    List<Device> findByDeviceType(String deviceType);

    Page<Device> findByDeviceType(String deviceType, Pageable pageable);

    List<Device> findByVehicleId(Integer vehicleId);

    List<Device> findByDriverId(Integer driverId);

    Page<Device> findByStatusAndDeviceType(String status, String deviceType, Pageable pageable);

    @Query("SELECT d FROM Device d WHERE d.deviceId LIKE %:keyword% " +
            "OR d.deviceModel LIKE %:keyword% " +
            "OR d.serialNumber LIKE %:keyword% " +
            "OR d.simNumber LIKE %:keyword% " +
            "OR d.gpsProvider LIKE %:keyword%")
    Page<Device> searchDevices(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT d FROM Device d WHERE d.status = :status " +
            "AND (:deviceType IS NULL OR d.deviceType = :deviceType) " +
            "AND (:vehicleId IS NULL OR d.vehicleId = :vehicleId) " +
            "AND (:driverId IS NULL OR d.driverId = :driverId)")
    Page<Device> findByFilters(@Param("status") String status,
            @Param("deviceType") String deviceType,
            @Param("vehicleId") Integer vehicleId,
            @Param("driverId") Integer driverId,
            Pageable pageable);

    @Query("SELECT d FROM Device d WHERE d.lastActive < :threshold AND d.status = 'Active'")
    List<Device> findInactiveDevices(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT d FROM Device d WHERE d.vehicleId IS NULL AND d.status = 'Active'")
    List<Device> findUnassignedDevices();

    @Query("SELECT COUNT(d) FROM Device d WHERE d.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT d.deviceType, COUNT(d) FROM Device d GROUP BY d.deviceType")
    List<Object[]> countByDeviceType();

    @Query("SELECT d.status, COUNT(d) FROM Device d GROUP BY d.status")
    List<Object[]> countByStatusGrouped();
}