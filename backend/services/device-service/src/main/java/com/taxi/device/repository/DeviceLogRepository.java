package com.taxi.device.repository;

import com.taxi.device.entity.DeviceLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeviceLogRepository extends JpaRepository<DeviceLog, Integer> {

    Page<DeviceLog> findByDeviceId(Integer deviceId, Pageable pageable);

    List<DeviceLog> findByDeviceIdOrderByCreatedAtDesc(Integer deviceId);

    Page<DeviceLog> findByLogType(String logType, Pageable pageable);

    Page<DeviceLog> findByLoggedBy(Integer loggedBy, Pageable pageable);

    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.id = :deviceId " +
            "AND dl.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY dl.createdAt DESC")
    Page<DeviceLog> findByDeviceIdAndDateRange(@Param("deviceId") Integer deviceId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.id = :deviceId " +
            "AND (:logType IS NULL OR dl.logType = :logType) " +
            "ORDER BY dl.createdAt DESC")
    Page<DeviceLog> findByDeviceIdAndLogType(@Param("deviceId") Integer deviceId,
            @Param("logType") String logType,
            Pageable pageable);

    @Query("SELECT dl FROM DeviceLog dl WHERE dl.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY dl.createdAt DESC")
    Page<DeviceLog> findByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.id = :deviceId " +
            "ORDER BY dl.createdAt DESC")
    List<DeviceLog> findRecentLogsByDeviceId(@Param("deviceId") Integer deviceId, Pageable pageable);

    @Query("SELECT dl.logType, COUNT(dl) FROM DeviceLog dl " +
            "WHERE dl.device.id = :deviceId GROUP BY dl.logType")
    List<Object[]> countLogsByTypeForDevice(@Param("deviceId") Integer deviceId);

    long countByDeviceId(Integer deviceId);
}