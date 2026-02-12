package com.taxi.promo.repository;

import com.taxi.promo.entity.PromoCodeUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for PromoCodeUsage entity
 * Provides database operations for promo code usage tracking
 */
@Repository
public interface PromoCodeUsageRepository extends JpaRepository<PromoCodeUsage, Integer> {

    /**
     * Find all usage records for a promo code
     */
    List<PromoCodeUsage> findByPromoCodeId(Integer promoCodeId);

    /**
     * Find usage records for a specific customer
     */
    List<PromoCodeUsage> findByContactNumber(String contactNumber);

    /**
     * Count usage by customer for a specific promo code
     */
    @Query("SELECT COUNT(u) FROM PromoCodeUsage u WHERE u.promoCode.id = :promoCodeId AND u.contactNumber = :contactNumber")
    Long countByPromoCodeIdAndContactNumber(@Param("promoCodeId") Integer promoCodeId,
            @Param("contactNumber") String contactNumber);

    /**
     * Find usage for a specific booking
     */
    List<PromoCodeUsage> findByBookingId(Integer bookingId);
}