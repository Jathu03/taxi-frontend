package com.taxi.driver.repository;

import com.taxi.driver.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Driver entity
 * Provides database operations for drivers
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {

    /**
     * Find driver by code
     */
    Optional<Driver> findByCode(String code);

    /**
     * Find driver by contact number
     */
    Optional<Driver> findByContactNumber(String contactNumber);

    /**
     * Find driver by user ID
     */
    Optional<Driver> findByUserId(Integer userId);

    /**
     * Check if driver code exists
     */
    boolean existsByCode(String code);

    /**
     * Check if contact number exists
     */
    boolean existsByContactNumber(String contactNumber);

    /**
     * Find drivers by company ID
     */
    List<Driver> findByCompanyId(Integer companyId);

    /**
     * Find drivers by vehicle ID
     */
    List<Driver> findByVehicleId(Integer vehicleId);

    /**
     * Search drivers by filter type
     */
    @Query("SELECT d FROM Driver d WHERE " +
            "(:filterType = 'firstName' AND LOWER(d.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR " +
            "(:filterType = 'code' AND LOWER(d.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR " +
            "(:filterType = 'contactNumber' AND d.contactNumber LIKE CONCAT('%', :searchTerm, '%'))")
    List<Driver> searchDrivers(@Param("filterType") String filterType, @Param("searchTerm") String searchTerm);

    /**
     * Find all active drivers
     */
    List<Driver> findByIsActiveTrue();

    /**
     * Find all blocked drivers
     */
    List<Driver> findByIsBlockedTrue();
}