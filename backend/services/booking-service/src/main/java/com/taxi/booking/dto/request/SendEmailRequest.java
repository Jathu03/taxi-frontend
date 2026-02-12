package com.taxi.booking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for sending email via Mail Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendEmailRequest {

    private String bookingId;
    private String recipientEmail;
    private String recipientName;
    private String templateCode;
    private Map<String, String> templateVariables;
}
