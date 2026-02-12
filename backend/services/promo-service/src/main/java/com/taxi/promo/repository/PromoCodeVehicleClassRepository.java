package com.taxi.promo.repository;

import com.taxi.promo.entity.PromoCodeVehicleClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for PromoCodeVehicleClass entity
 * Provides database operations for promo code-vehicle class relationships
 */
@Repository
public interface PromoCodeVehicleClassRepository extends JpaRepository<PromoCodeVehicleClass, Integer> {

        /**
         * Find all vehicle class assignments for a promo code
         */
        List<PromoCodeVehicleClass> findByPromoCodeId(Integer promoCodeId);

        /**
         * Delete all vehicle class assignments for a promo code
         */
        void deleteByPromoCodeId(Integer promoCodeId);

        /**
         * Check if vehicle class is already assigned to promo code
         */
        boolean existsByPromoCodeIdAndVehicleClassId(Integer promoCodeId, Integer vehicleClassId);
}