package com.taxi.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for sending emails via Mail Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendEmailRequest {

    private String bookingId;
    private String recipientEmail;
    private String recipientName;
    private String templateCode;
    private Map<String, String> templateVariables;
}
