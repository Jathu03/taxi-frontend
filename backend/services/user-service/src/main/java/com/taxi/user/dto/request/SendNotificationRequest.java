package com.taxi.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for sending notifications to Notification Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendNotificationRequest {

    private String notificationTypeCode;

    private String recipientType;
    private Integer recipientId;
    private String recipientPhone;
    private String recipientEmail;
    private String recipientName;
    private String deviceToken;

    private Integer bookingId;
    private Integer driverId;
    private Integer userId;

    private Map<String, String> templateVariables;

    private String triggeredBy;
    private Integer triggeredByUserId;
}