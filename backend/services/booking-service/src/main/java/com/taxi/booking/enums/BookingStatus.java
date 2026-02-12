package com.taxi.booking.enums;

/**
 * Enum for Booking Status
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