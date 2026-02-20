package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.VehicleClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleClassRepository extends JpaRepository<VehicleClass, Integer> {

    // For dropdowns in other services (Promo/Fare)
    List<VehicleClass> findByShowInAppTrue();

    boolean existsByClassName(String className);
}