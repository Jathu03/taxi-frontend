package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

        boolean existsByRegistrationNumber(String regNumber);

        boolean existsByVehicleCode(String code);

        @Query("SELECT v FROM Vehicle v " +
        // 1. Explicitly LEFT JOIN the related entities
                        "LEFT JOIN v.owner o " +
                        "LEFT JOIN v.make m " +
                        "LEFT JOIN v.model mo " +
                        "WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        " (LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
                        " (LOWER(v.vehicleCode) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
                        // 2. Use the aliases (o, m, mo) instead of v.owner, v.make
                        " (o.name IS NOT NULL AND LOWER(o.name) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
                        " (mo.model IS NOT NULL AND LOWER(mo.model) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
                        " (m.manufacturer IS NOT NULL AND LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')))) "
                        +
                        "AND (:isActive IS NULL OR v.isActive = :isActive)")
        Page<Vehicle> searchVehicles(@Param("search") String search,
                        @Param("isActive") Boolean isActive,
                        Pageable pageable);
}