package com.taxi.farepromo.repository;

import com.taxi.farepromo.entity.PromoCodeVehicleClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromoCodeVehicleClassRepository extends JpaRepository<PromoCodeVehicleClass, Integer> {

    List<PromoCodeVehicleClass> findByPromoCodeId(Integer promoCodeId);

    void deleteByPromoCodeId(Integer promoCodeId);

    boolean existsByPromoCodeIdAndVehicleClassId(Integer promoCodeId, Integer vehicleClassId);
}