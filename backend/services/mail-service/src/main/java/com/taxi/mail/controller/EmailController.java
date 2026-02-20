package com.taxi.mail.controller;

import com.taxi.mail.dto.request.SendEmailRequest;
import com.taxi.mail.dto.response.EmailResponse;
import com.taxi.mail.dto.response.NotificationLogResponse;
import com.taxi.mail.entity.Notification;
import com.taxi.mail.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for email operations
 */
@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    /**
     * Send email
     * POST /api/emails/send
     */
    @PostMapping("/send")
    public ResponseEntity<EmailResponse> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        log.info("Received email send request for booking: {}, template: {}",
                request.getBookingId(), request.getTemplateCode());

        EmailResponse response = emailService.sendEmail(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get email logs for a booking
     * GET /api/emails/logs/{bookingId}
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<NotificationLogResponse>> getEmailLogs(@PathVariable String bookingId) {
        // The service now returns List<NotificationLogResponse>, so Jackson is happy
        return ResponseEntity.ok(emailService.getEmailLogsByBooking(bookingId));
    }

    /**
     * Retry failed email
     * POST /api/emails/retry/{notificationId}
     */
    @PostMapping("/retry/{notificationId}")
    public ResponseEntity<EmailResponse> retryEmail(@PathVariable Integer notificationId) {
        log.info("Retrying email for notification ID: {}", notificationId);
        EmailResponse response = emailService.retryEmail(notificationId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get retryable failed emails
     * GET /api/emails/failed?maxRetries=3
     */
    @GetMapping("/failed")
    public ResponseEntity<List<Notification>> getFailedEmails(
            @RequestParam(defaultValue = "3") int maxRetries) {
        log.info("Fetching failed emails (maxRetries param ignored in new schema): {}", maxRetries);
        List<Notification> failedEmails = emailService.getRetryableEmails(maxRetries);
        return ResponseEntity.ok(failedEmails);
    }
}
