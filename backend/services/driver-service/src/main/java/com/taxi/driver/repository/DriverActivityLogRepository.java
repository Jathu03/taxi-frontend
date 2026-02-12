package com.taxi.driver.repository;

import com.taxi.driver.entity.DriverActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for DriverActivityLog entity
 * Provides database operations for driver activity logs
 */
@Repository
public interface DriverActivityLogRepository extends JpaRepository<DriverActivityLog, Integer> {

    /**
     * Find activity logs by driver ID
     */
    List<DriverActivityLog> findByDriverIdOrderByLogDateDesc(Integer driverId);

    /**
     * Find activity logs by driver ID and date range
     */
    List<DriverActivityLog> findByDriverIdAndLogDateBetweenOrderByLogDateDesc(
            Integer driverId, LocalDate startDate, LocalDate endDate);

    /**
     * Find activity logs by date range
     */
    List<DriverActivityLog> findByLogDateBetweenOrderByLogDateDesc(
            LocalDate startDate, LocalDate endDate);

    /**
     * Search activity logs by filter type and date range
     */
    @Query("SELECT dal FROM DriverActivityLog dal " +
            "WHERE dal.logDate BETWEEN :startDate AND :endDate " +
            "AND (" +
            "(:filterType = 'firstName' AND LOWER(dal.driver.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR "
            +
            "(:filterType = 'code' AND LOWER(dal.driver.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR " +
            "(:filterType = 'contactNumber' AND dal.driver.contactNumber LIKE CONCAT('%', :searchTerm, '%')))" +
            "ORDER BY dal.logDate DESC")
    List<DriverActivityLog> searchActivityLogs(
            @Param("filterType") String filterType,
            @Param("searchTerm") String searchTerm,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Find activity logs by driver and activity type
     */
    List<DriverActivityLog> findByDriverIdAndActivityType(Integer driverId, String activityType);
}