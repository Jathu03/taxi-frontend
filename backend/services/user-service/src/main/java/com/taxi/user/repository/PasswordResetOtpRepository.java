package com.taxi.user.repository;

import com.taxi.user.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Integer> {

    /**
     * Find the most recent unused, non-expired OTP for an email
     */
    @Query("SELECT o FROM PasswordResetOtp o WHERE o.email = :email AND o.otpCode = :otpCode " +
            "AND o.used = false AND o.expiresAt > CURRENT_TIMESTAMP ORDER BY o.createdAt DESC")
    Optional<PasswordResetOtp> findValidOtp(@Param("email") String email, @Param("otpCode") String otpCode);

    /**
     * Invalidate all previous OTPs for an email before issuing a new one
     */
    @Modifying
    @Query("UPDATE PasswordResetOtp o SET o.used = true WHERE o.email = :email AND o.used = false")
    void invalidateAllForEmail(@Param("email") String email);
}
