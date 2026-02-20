package com.taxi.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Stores time-limited OTP codes for password reset requests.
 */
@Entity
@Table(name = "password_reset_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 6)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean used = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
