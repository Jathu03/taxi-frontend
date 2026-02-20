package com.taxi.mail.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class SmsRequestDto {
    @NotNull(message = "Phone numbers are required")
    private List<String> phoneNumbers;

    @NotBlank(message = "Message content is required")
    private String message;

    @NotBlank(message = "SMS Type is required")
    private String smsType; // e.g., "MARKETING", "SYSTEM"

    // Optional metadata for logging
    private Long driverId;
    private Long corporateId;
    private Long vehicleClassId;
    private Long sentByUserId;
}