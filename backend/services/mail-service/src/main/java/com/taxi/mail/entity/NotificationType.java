package com.taxi.mail.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing notification type
 * Maps to notification_types table
 */
@Entity
@Table(name = "notification_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type_code", nullable = false, unique = true, length = 50)
    private String typeCode;

    @Column(name = "type_name", nullable = false, length = 100)
    private String typeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "send_sms", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean sendSms;

    @Column(name = "send_email", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean sendEmail;

    @Column(name = "send_push", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean sendPush;

    @Column(name = "sms_template", columnDefinition = "TEXT")
    private String smsTemplate;

    @Column(name = "email_subject", columnDefinition = "TEXT")
    private String emailSubject;

    @Column(name = "email_template", columnDefinition = "TEXT")
    private String emailTemplate;

    @Column(name = "push_title", columnDefinition = "TEXT")
    private String pushTitle;

    @Column(name = "push_template", columnDefinition = "TEXT")
    private String pushTemplate;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
