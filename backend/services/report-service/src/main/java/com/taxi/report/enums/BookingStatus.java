package com.taxi.report.enums;

/**
 * Enum for Booking Status (must match booking-service)
 */
public enum BookingStatus {
    INQUIRY,
    PENDING,
    DISPATCHED,
    ENROUTE,
    WAITING_FOR_CUSTOMER,
    PASSENGER_ONBOARD,
    COMPLETED,
    CANCELLED
}