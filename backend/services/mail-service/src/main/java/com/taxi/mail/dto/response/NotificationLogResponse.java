package com.taxi.mail.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationLogResponse {
    private Integer id;
    private Integer bookingId;
    private String recipientEmail;
    private String recipientName;
    private String emailSubject;
    private String emailStatus;
    private LocalDateTime emailSentAt;
    private String emailError;
    private LocalDateTime createdAt;

    // We add these string fields to avoid sending the entire NotificationType
    // object
    private String templateCode;
    private String templateName;
}