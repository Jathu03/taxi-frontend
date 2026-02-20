package com.taxi.mail.entity;

import com.taxi.mail.enums.EmailStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing email log
 * Tracks all emails sent by the system
 */
@Entity
@Table(name = "email_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "booking_id", length = 20)
    private String bookingId;

    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    @Column(name = "recipient_name", length = 200)
    private String recipientName;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(name = "template_name", length = 100)
    private String templateName;

    @Column(name = "email_content", columnDefinition = "TEXT")
    private String emailContent;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count", columnDefinition = "INT DEFAULT 0")
    private Integer retryCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
