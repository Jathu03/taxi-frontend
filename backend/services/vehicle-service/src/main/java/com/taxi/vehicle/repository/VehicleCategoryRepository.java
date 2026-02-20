package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.VehicleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleCategoryRepository extends JpaRepository<VehicleCategory, Integer> {
    List<VehicleCategory> findByIsActiveTrue();
}