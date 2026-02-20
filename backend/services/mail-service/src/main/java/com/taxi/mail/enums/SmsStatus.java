package com.taxi.mail.enums;

public enum SmsStatus {
    PENDING,
    SENT,
    FAILED,
    PARTIAL // If sent to some numbers but failed for others
}