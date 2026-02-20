package com.taxi.mail.service;

import com.taxi.mail.dto.request.SendEmailRequest;
import com.taxi.mail.dto.response.EmailResponse;
import com.taxi.mail.dto.response.NotificationLogResponse;
import com.taxi.mail.entity.Notification;
import com.taxi.mail.entity.NotificationType;
import com.taxi.mail.enums.EmailStatus;
import com.taxi.mail.repository.NotificationRepository;
import com.taxi.mail.repository.NotificationTypeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for handling email operations
 * Refactored to work with unified Notification system
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationTypeRepository notificationTypeRepository;
    private final NotificationRepository notificationRepository;

    /**
     * Send email based on template
     */
    @Transactional
    public EmailResponse sendEmail(SendEmailRequest request) {
        // Get notification type (template)
        NotificationType type = notificationTypeRepository.findByTypeCode(request.getTemplateCode())
                .orElseThrow(() -> new RuntimeException("Notification type not found: " + request.getTemplateCode()));

        if (!type.getIsActive()) {
            throw new RuntimeException("Notification type is not active: " + request.getTemplateCode());
        }

        // Check if email channel is enabled for this type
        if (!Boolean.TRUE.equals(type.getSendEmail())) {
            log.info("Email channel disabled for notification type: {}", request.getTemplateCode());
            return EmailResponse.error("Email channel disabled for type: " + request.getTemplateCode());
        }

        // Process template with variables
        String subject = processTemplate(type.getEmailSubject(), request.getTemplateVariables());
        String body = processTemplate(type.getEmailTemplate(), request.getTemplateVariables());

        // Create notification log
        Notification notification = new Notification();
        // Since schema uses Integer for IDs, we parse if possible or handle
        // accordingly.
        // Assuming bookingId in request is parseable to Integer as per new schema
        try {
            notification.setBookingId(Integer.parseInt(request.getBookingId()));
        } catch (NumberFormatException e) {
            log.warn("Could not parse bookingId {} to Integer", request.getBookingId());
            // proceed with null or handle error? For now letting it be null or handle as
            // string if entity allows (entity set to Integer)
        }

        notification.setNotificationType(type);
        notification.setRecipientType("CUSTOMER"); // Defaulting to CUSTOMER for now, can be dynamic
        notification.setRecipientEmail(request.getRecipientEmail());
        notification.setRecipientName(request.getRecipientName());

        notification.setEmailSubject(subject);
        notification.setEmailContent(body);
        notification.setEmailStatus(EmailStatus.PENDING.name());

        // Save log
        notification = notificationRepository.save(notification);

        // Send email
        try {
            sendHtmlEmail(request.getRecipientEmail(), subject, body);

            // Update log as sent
            notification.setEmailStatus(EmailStatus.SENT.name());
            notification.setEmailSentAt(LocalDateTime.now());
            notificationRepository.save(notification);

            log.info("Email sent successfully to {} for booking {}", request.getRecipientEmail(),
                    request.getBookingId());
            return EmailResponse.success("Email sent successfully", notification.getId());

        } catch (MessagingException e) {
            // Update log as failed
            notification.setEmailStatus(EmailStatus.FAILED.name());
            notification.setEmailError(e.getMessage());
            notificationRepository.save(notification);

            log.error("Failed to send email to {}: {}", request.getRecipientEmail(), e.getMessage());
            return EmailResponse.error("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Process template by replacing placeholders with actual values
     * Placeholders format: {{variableName}}
     */
    private String processTemplate(String template, Map<String, String> variables) {
        if (template == null || variables == null) {
            return template;
        }

        String processed = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            String value = entry.getValue() != null ? entry.getValue() : "";

            // Support both {{var}} and ${var} formats (with or without spaces)
            processed = processed.replace("{{" + entry.getKey() + "}}", value);
            processed = processed.replace("{{ " + entry.getKey() + " }}", value);
            processed = processed.replace("${" + entry.getKey() + "}", value);
            processed = processed.replace("${ " + entry.getKey() + " }", value);
        }

        return processed;
    }

    /**
     * Send HTML email using JavaMailSender
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true indicates HTML

        mailSender.send(message);
    }

    /**
     * Retry sending a failed email
     */
    @Transactional
    public EmailResponse retryEmail(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (EmailStatus.SENT.name().equals(notification.getEmailStatus())) {
            return EmailResponse.error("Email already sent");
        }

        try {
            sendHtmlEmail(notification.getRecipientEmail(), notification.getEmailSubject(),
                    notification.getEmailContent());

            notification.setEmailStatus(EmailStatus.SENT.name());
            notification.setEmailSentAt(LocalDateTime.now());
            // Retry count logic might need update if schema supports it, strictly following
            // provided schema 'retry_count' exists?
            // In provided schema: retry_count INT DEFAULT 0 exists in email_logs but mostly
            // likely likely in notifications too?
            // Checking user request: YES, notifications likely has generic retry logic or
            // we use fields provided.
            // User schema for `notifications` DOES NOT show a generic `retry_count`.
            // I will skip updating retry_count if column is missing or handle if
            // comfortable.
            // Wait, looking at provided schema 2nd block:
            // CREATE TABLE notifications (... sms_status, email_status... ); NO retry_count
            // column explicitly listed in the big CREATE TABLE block provided by user.
            // So I will remove retry count logic to be safe, or just update query.

            notificationRepository.save(notification);

            log.info("Email retry successful for notification ID {}", notificationId);
            return EmailResponse.success("Email sent successfully on retry", notificationId);

        } catch (MessagingException e) {
            notification.setEmailError(e.getMessage());
            notificationRepository.save(notification);

            log.error("Email retry failed for notification ID {}: {}", notificationId, e.getMessage());
            return EmailResponse.error("Retry failed: " + e.getMessage());
        }
    }

    /**
     * Get all email logs for a booking
     */
    @Transactional(readOnly = true) // <--- CRITICAL: Keeps session open for lazy loading
    public List<NotificationLogResponse> getEmailLogsByBooking(String bookingId) {
        try {
            Integer parsedId = Integer.parseInt(bookingId);
            List<Notification> notifications = notificationRepository.findByBookingId(parsedId);

            // Map Entity list to DTO list
            return notifications.stream()
                    .map(this::mapToLogResponse)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            log.warn("Invalid booking Id format: {}", bookingId);
            return List.of();
        }
    }

    // Helper method to convert Entity -> DTO
    private NotificationLogResponse mapToLogResponse(Notification n) {
        return NotificationLogResponse.builder()
                .id(n.getId())
                .bookingId(n.getBookingId())
                .recipientEmail(n.getRecipientEmail())
                .recipientName(n.getRecipientName())
                .emailSubject(n.getEmailSubject())
                .emailStatus(n.getEmailStatus())
                .emailSentAt(n.getEmailSentAt())
                .emailError(n.getEmailError())
                .createdAt(n.getCreatedAt())
                // Safe extraction of lazy loaded data
                .templateCode(n.getNotificationType() != null ? n.getNotificationType().getTypeCode() : null)
                .templateName(n.getNotificationType() != null ? n.getNotificationType().getTypeName() : null)
                .build();
    }

    /**
     * Get failed emails that can be retried
     */
    public List<Notification> getRetryableEmails(int maxRetries) {
        // Logic might need adjustment since we don't have retry_count in standard
        // schema provided.
        // Returning simple failed ones.
        return notificationRepository.findByEmailStatus(EmailStatus.FAILED.name());
    }
}
