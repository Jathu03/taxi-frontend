package com.taxi.driver.repository;

import com.taxi.driver.entity.DriverActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DriverActivityLogRepository extends JpaRepository<DriverActivityLog, Integer> {

        Page<DriverActivityLog> findByDriverId(Integer driverId, Pageable pageable);

        List<DriverActivityLog> findByDriverIdOrderByCreatedAtDesc(Integer driverId);

        Page<DriverActivityLog> findByActivityType(String activityType, Pageable pageable);

        Page<DriverActivityLog> findByLogDate(LocalDate logDate, Pageable pageable);

        Page<DriverActivityLog> findByDriverIdAndActivityType(Integer driverId, String activityType, Pageable pageable);

        @Query("SELECT dal FROM DriverActivityLog dal WHERE dal.driver.id = :driverId " +
                        "AND dal.logDate BETWEEN :startDate AND :endDate " +
                        "ORDER BY dal.createdAt DESC")
        Page<DriverActivityLog> findByDriverIdAndDateRange(@Param("driverId") Integer driverId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query("SELECT dal FROM DriverActivityLog dal WHERE dal.logDate BETWEEN :startDate AND :endDate " +
                        "ORDER BY dal.createdAt DESC")
        Page<DriverActivityLog> findByDateRange(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query("SELECT dal FROM DriverActivityLog dal WHERE dal.driver.id = :driverId " +
                        "AND (:activityType IS NULL OR dal.activityType = :activityType) " +
                        "AND (:logDate IS NULL OR dal.logDate = :logDate) " +
                        "ORDER BY dal.createdAt DESC")
        Page<DriverActivityLog> findByDriverIdWithFilters(@Param("driverId") Integer driverId,
                        @Param("activityType") String activityType,
                        @Param("logDate") LocalDate logDate,
                        Pageable pageable);

        @Query("SELECT dal FROM DriverActivityLog dal WHERE dal.vehicleId = :vehicleId " +
                        "ORDER BY dal.createdAt DESC")
        Page<DriverActivityLog> findByVehicleId(@Param("vehicleId") Integer vehicleId, Pageable pageable);

        @Query("SELECT dal FROM DriverActivityLog dal WHERE dal.driver.id = :driverId " +
                        "ORDER BY dal.createdAt DESC")
        List<DriverActivityLog> findRecentLogsByDriverId(@Param("driverId") Integer driverId, Pageable pageable);

        @Query("SELECT dal.activityType, COUNT(dal) FROM DriverActivityLog dal " +
                        "WHERE dal.driver.id = :driverId GROUP BY dal.activityType")
        List<Object[]> countByActivityTypeForDriver(@Param("driverId") Integer driverId);

        @Query("SELECT dal.activityType, COUNT(dal) FROM DriverActivityLog dal " +
                        "WHERE dal.logDate BETWEEN :startDate AND :endDate GROUP BY dal.activityType")
        List<Object[]> countByActivityTypeForDateRange(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT SUM(dal.totalOnlineDuration) FROM DriverActivityLog dal " +
                        "WHERE dal.driver.id = :driverId AND dal.logDate BETWEEN :startDate AND :endDate")
        Long getTotalOnlineDurationForDriver(@Param("driverId") Integer driverId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT dal.driver.id, SUM(dal.totalOnlineDuration) FROM DriverActivityLog dal " +
                        "WHERE dal.logDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY dal.driver.id ORDER BY SUM(dal.totalOnlineDuration) DESC")
        List<Object[]> getOnlineDurationByDriverForDateRange(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        long countByDriverId(Integer driverId);

        long countByDriverIdAndLogDate(Integer driverId, LocalDate logDate);
}