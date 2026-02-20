package com.taxi.mail.entity;

import com.taxi.mail.enums.SmsStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "sms_logs")
public class SmsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sms_type", nullable = false, length = 30)
    private String smsType; // e.g., "PROMO", "OTP", "ALERT"

    @Column(name = "phone_numbers", nullable = false, columnDefinition = "TEXT")
    private String phoneNumbers; // Comma separated if multiple

    @Column(name = "recipient_count")
    private Integer recipientCount = 1;

    @Column(name = "vehicle_class_id")
    private Long vehicleClassId;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "corporate_id")
    private Long corporateId;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private SmsStatus status = SmsStatus.PENDING;

    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "failed_count")
    private Integer failedCount = 0;

    @Column(name = "provider_name", length = 50)
    private String providerName;

    @Column(name = "provider_batch_id", length = 100)
    private String providerBatchId;

    @Column(name = "provider_response", columnDefinition = "TEXT")
    private String providerResponse;

    @Column(name = "sent_by")
    private Long sentBy; // User ID of admin who triggered it

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}