package com.taxi.farepromo.repository;

import com.taxi.farepromo.entity.PromoCodeUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromoCodeUsageRepository extends JpaRepository<PromoCodeUsage, Integer> {

        List<PromoCodeUsage> findByPromoCodeId(Integer promoCodeId);

        List<PromoCodeUsage> findByContactNumber(String contactNumber);

        Page<PromoCodeUsage> findByPromoCodeId(Integer promoCodeId, Pageable pageable);

        @Query("SELECT COUNT(u) FROM PromoCodeUsage u WHERE " +
                        "u.promoCode.id = :promoCodeId AND u.contactNumber = :contactNumber")
        long countByPromoCodeIdAndContactNumber(@Param("promoCodeId") Integer promoCodeId,
                        @Param("contactNumber") String contactNumber);

        @Query("SELECT COALESCE(SUM(u.discountApplied), 0) FROM PromoCodeUsage u WHERE " +
                        "u.promoCode.id = :promoCodeId")
        java.math.BigDecimal sumDiscountByPromoCodeId(@Param("promoCodeId") Integer promoCodeId);
}