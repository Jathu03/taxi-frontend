package com.taxi.mail.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a notification log
 * Maps to notifications table
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_type_id", nullable = false)
    private NotificationType notificationType;

    @Column(name = "recipient_type", nullable = false, length = 20)
    private String recipientType;

    @Column(name = "recipient_id")
    private Integer recipientId;

    @Column(name = "recipient_phone", length = 20)
    private String recipientPhone;

    @Column(name = "recipient_email", length = 255)
    private String recipientEmail;

    @Column(name = "recipient_name", length = 200)
    private String recipientName;

    @Column(name = "device_token", length = 255)
    private String deviceToken;

    @Column(name = "booking_id")
    private Integer bookingId; // Changed to Integer based on schema foreign key

    // Other FKs omitted for simplicity as we don't have those entities in this
    // microservice context yet
    // simplified for mail-service usage

    @Column(name = "email_subject", length = 255)
    private String emailSubject;

    @Column(name = "email_content", columnDefinition = "TEXT")
    private String emailContent;

    @Column(name = "email_status", length = 20)
    private String emailStatus;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "email_error", columnDefinition = "TEXT")
    private String emailError;

    @Column(name = "triggered_by", length = 20)
    private String triggeredBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
