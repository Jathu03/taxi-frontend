package com.taxi.driver.repository;

import com.taxi.driver.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer>, JpaSpecificationExecutor<Driver> {

        // =================================================================
        // FIX: Custom Query to ensure we fetch ALL drivers (ignoring soft deletes if
        // configured)
        // =================================================================
        @Query("SELECT d FROM Driver d")
        Page<Driver> findAllDriversRaw(Pageable pageable);

        Optional<Driver> findByCode(String code);

        boolean existsByCode(String code);

        boolean existsByContactNumber(String contactNumber);

        Optional<Driver> findByContactNumber(String contactNumber);

        Optional<Driver> findByNic(String nic);

        Optional<Driver> findByUserId(Integer userId);

        List<Driver> findByIsActive(Boolean isActive);

        Page<Driver> findByIsActive(Boolean isActive, Pageable pageable);

        List<Driver> findByIsBlocked(Boolean isBlocked);

        Page<Driver> findByIsBlocked(Boolean isBlocked, Pageable pageable);

        Page<Driver> findByIsVerified(Boolean isVerified, Pageable pageable);

        List<Driver> findByVehicleId(Integer vehicleId);

        List<Driver> findByCompanyId(Integer companyId);

        Page<Driver> findByCompanyId(Integer companyId, Pageable pageable);

        Page<Driver> findByIsActiveAndIsBlocked(Boolean isActive, Boolean isBlocked, Pageable pageable);

        @Query("SELECT d FROM Driver d WHERE d.code LIKE %:keyword% " +
                        "OR d.firstName LIKE %:keyword% " +
                        "OR d.lastName LIKE %:keyword% " +
                        "OR d.contactNumber LIKE %:keyword% " +
                        "OR d.nic LIKE %:keyword% " +
                        "OR d.licenseNumber LIKE %:keyword%")
        Page<Driver> searchDrivers(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT d FROM Driver d WHERE " +
                        "(:isActive IS NULL OR d.isActive = :isActive) " +
                        "AND (:isBlocked IS NULL OR d.isBlocked = :isBlocked) " +
                        "AND (:isVerified IS NULL OR d.isVerified = :isVerified) " +
                        "AND (:companyId IS NULL OR d.companyId = :companyId) " +
                        "AND (:manualDispatchOnly IS NULL OR d.manualDispatchOnly = :manualDispatchOnly)")
        Page<Driver> findByFilters(@Param("isActive") Boolean isActive,
                        @Param("isBlocked") Boolean isBlocked,
                        @Param("isVerified") Boolean isVerified,
                        @Param("companyId") Integer companyId,
                        @Param("manualDispatchOnly") Boolean manualDispatchOnly,
                        Pageable pageable);

        @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate < :date AND d.isActive = true")
        List<Driver> findDriversWithExpiredLicense(@Param("date") LocalDate date);

        @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate BETWEEN :today AND :threshold AND d.isActive = true")
        List<Driver> findDriversWithExpiringLicense(@Param("today") LocalDate today,
                        @Param("threshold") LocalDate threshold);

        @Query("SELECT d FROM Driver d WHERE d.vehicleId IS NULL AND d.isActive = true AND d.isBlocked = false")
        List<Driver> findUnassignedDrivers();

        @Query("SELECT d FROM Driver d WHERE d.vehicleId IS NULL AND d.isActive = true AND d.isBlocked = false")
        Page<Driver> findUnassignedDrivers(Pageable pageable);

        @Query("SELECT d FROM Driver d WHERE d.isActive = true AND d.isBlocked = false " +
                        "AND d.manualDispatchOnly = false ORDER BY d.averageRating DESC")
        List<Driver> findAvailableDrivers();

        @Query("SELECT d FROM Driver d WHERE d.isActive = true AND d.isBlocked = false " +
                        "AND d.manualDispatchOnly = false ORDER BY d.averageRating DESC")
        Page<Driver> findAvailableDrivers(Pageable pageable);

        @Query("SELECT COUNT(d) FROM Driver d WHERE d.isActive = :isActive")
        long countByIsActive(@Param("isActive") Boolean isActive);

        @Query("SELECT COUNT(d) FROM Driver d WHERE d.isBlocked = true")
        long countBlocked();

        @Query("SELECT COUNT(d) FROM Driver d WHERE d.isVerified = true AND d.isActive = true")
        long countVerified();

        @Query("SELECT COUNT(d) FROM Driver d WHERE d.vehicleId IS NULL AND d.isActive = true")
        long countUnassigned();

        @Query("SELECT d.companyId, COUNT(d) FROM Driver d WHERE d.isActive = true GROUP BY d.companyId")
        List<Object[]> countByCompany();

        @Query("SELECT AVG(d.averageRating) FROM Driver d WHERE d.isActive = true")
        Double getOverallAverageRating();
}