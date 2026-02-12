package com.taxi.mail.enums;

/**
 * Enum representing email sending status
 */
public enum EmailStatus {
    PENDING, // Email queued but not yet sent
    SENT, // Email successfully sent
    FAILED // Email sending failed
}
