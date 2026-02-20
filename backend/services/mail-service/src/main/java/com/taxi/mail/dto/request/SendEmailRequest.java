package com.taxi.mail.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for sending email
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendEmailRequest {

    private String bookingId;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    private String recipientEmail;

    private String recipientName;

    @NotBlank(message = "Template code is required")
    private String templateCode;

    /**
     * Variables to replace in the email template
     * Example: {"driverName": "John Doe", "vehicleNumber": "ABC-1234"}
     */
    private Map<String, String> templateVariables;
}
