package com.taxi.mail.enums;

/**
 * Enum for email template codes
 * Each code corresponds to a specific booking event
 */
public enum EmailTemplateCode {
    BOOKING_CREATED, // When a new booking is created
    BOOKING_DISPATCHED, // When a driver is dispatched
    DRIVER_ARRIVED, // When driver arrives at pickup location
    TRIP_STARTED, // When trip/journey starts
    TRIP_COMPLETED, // When trip is completed
    BOOKING_CANCELLED, // When booking is cancelled
    DRIVER_ACCEPTED, // When driver accepts the booking
    WAITING_FOR_CUSTOMER, // When driver is waiting for customer
    PASSENGER_ONBOARD // When passenger is onboard
}
