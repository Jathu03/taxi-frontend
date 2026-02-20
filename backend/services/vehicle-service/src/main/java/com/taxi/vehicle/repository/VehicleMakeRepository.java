package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.VehicleMake;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleMakeRepository extends JpaRepository<VehicleMake, Integer> {

    Optional<VehicleMake> findByManufacturer(String manufacturer);

    boolean existsByManufacturer(String manufacturer);

    boolean existsByManufacturerCode(String manufacturerCode);

    @Query("SELECT m FROM VehicleMake m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.manufacturerCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VehicleMake> searchMakes(@Param("search") String search, Pageable pageable);
}