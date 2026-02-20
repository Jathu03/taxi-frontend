package com.taxi.user.service;

import com.taxi.user.dto.request.ForgotPasswordRequest;
import com.taxi.user.dto.request.VerifyOtpRequest;
import com.taxi.user.entity.PasswordResetOtp;
import com.taxi.user.entity.User;
import com.taxi.user.repository.PasswordResetOtpRepository;
import com.taxi.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Handles the forgot-password OTP flow:
 * 1. generateAndSendOtp – generates a 6-digit code, saves it, emails it to the
 * user
 * 2. verifyOtp – validates the code, marks it used, returns the user ID
 * so the frontend can redirect to the reset-password page
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    private static final SecureRandom RANDOM = new SecureRandom();

    // ─────────────────────────────────────────────────────────────
    // Step 1 – Send OTP
    // ─────────────────────────────────────────────────────────────

    /**
     * Entry point for sending OTP.
     * We use transactionTemplate to ensure the DB write is committed BEFORE we
     * attempt mail sending.
     */
    public void generateAndSendOtp(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address."));

        // Step 1.1: Persist OTP code to database (Transactional & Committed)
        String otp = transactionTemplate.execute(status -> {
            otpRepository.invalidateAllForEmail(email);
            String code = String.format("%06d", RANDOM.nextInt(1_000_000));
            PasswordResetOtp entity = new PasswordResetOtp();
            entity.setEmail(email);
            entity.setOtpCode(code);
            entity.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
            entity.setUsed(false);
            otpRepository.save(entity);
            return code;
        });

        // ALWAYS log OTP to console for easy developer testing if SMTP fails
        log.info("**************************************************");
        log.info("FORGOT PASSWORD OTP FOR {}: {}", email, otp);
        log.info("**************************************************");

        // Step 1.2: Send actual email (Non-Transactional)
        try {
            sendOtpEmail(email, user.getFirstName(), otp);
            log.info("OTP email successfully sent to {}", email);
        } catch (Exception e) {
            log.error("SMTP FAILURE: Failed to send OTP email to {}. Reason: {}", email, e.getMessage());
            log.warn("Test flow can continue using the OTP printed in the console above.");
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Step 2 – Verify OTP
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public Integer verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        PasswordResetOtp otp = otpRepository.findValidOtp(email, request.getOtpCode())
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP. Please try again."));

        // Mark as used so it cannot be reused
        otp.setUsed(true);
        otpRepository.save(otp);

        // Return the user ID for redirect
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        log.info("OTP verified successfully for {}, userId={}", email, user.getId());
        return user.getId();
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private void sendOtpEmail(String to, String firstName, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Your Password Reset Code – KPV Taxi");
        helper.setText(buildEmailHtml(firstName, otp), true);

        mailSender.send(message);
    }

    private String buildEmailHtml(String name, String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;">
                  <div style="max-width:480px;margin:auto;background:#fff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.1)">
                    <h2 style="color:#6330B8;margin-bottom:8px;">Password Reset</h2>
                    <p style="color:#555;">Hello <strong>%s</strong>,</p>
                    <p style="color:#555;">Use the code below to reset your KPV Taxi account password.
                       This code expires in <strong>%d minutes</strong>.</p>
                    <div style="font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;
                                color:#6330B8;background:#f0ebff;padding:20px;border-radius:8px;margin:24px 0">
                      %s
                    </div>
                    <p style="color:#999;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
                  </div>
                </body>
                </html>
                """
                .formatted(name, otpExpiryMinutes, otp);
    }
}
