package com.taxi.mail.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for email operations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {

    private boolean success;
    private String message;
    private Integer emailLogId;

    /**
     * Create success response
     */
    public static EmailResponse success(String message, Integer emailLogId) {
        return new EmailResponse(true, message, emailLogId);
    }

    /**
     * Create error response
     */
    public static EmailResponse error(String message) {
        return new EmailResponse(false, message, null);
    }
}
