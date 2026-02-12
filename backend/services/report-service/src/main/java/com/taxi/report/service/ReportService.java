package com.taxi.report.service;

import com.taxi.report.client.BookingServiceClient;
import com.taxi.report.client.DriverServiceClient;
import com.taxi.report.client.VehicleServiceClient;
import com.taxi.report.dto.response.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final BookingServiceClient bookingServiceClient;
    private final VehicleServiceClient vehicleServiceClient;
    private final DriverServiceClient driverServiceClient;

    /**
     * Aggregates booking counts from different endpoints to create a summary.
     */
    public BookingStatusSummaryResponse getBookingStatusSummary() {
        log.info("Generating booking status summary report");

        // Fetching lists (size() gives the count)
        // Note: For high volume systems, specific count endpoints in booking-service
        // are better,
        // but this works for the current aggregation architecture.
        long inquiry = bookingServiceClient.getInquiries().size();
        long pending = bookingServiceClient.getPendingBookings().size();
        long appPending = bookingServiceClient.getAppPendingBookings().size();
        long dispatched = bookingServiceClient.getDispatchedBookings().size();
        long enroute = bookingServiceClient.getEnrouteBookings().size();
        long waiting = bookingServiceClient.getWaitingBookings().size();
        long onboard = bookingServiceClient.getPassengerOnboardBookings().size();
        long completed = bookingServiceClient.getCompletedHires().size();
        long cancelled = bookingServiceClient.getCancelledHires().size();

        return BookingStatusSummaryResponse.builder()
                .inquiryCount(inquiry)
                .pendingCount(pending)
                .appPendingCount(appPending)
                .dispatchedCount(dispatched)
                .enrouteCount(enroute)
                .waitingForCustomerCount(waiting)
                .passengerOnboardCount(onboard)
                .completedCount(completed)
                .cancelledCount(cancelled)
                .build();
    }

    public List<BookingResponse> getInquiryBookings() {
        log.info("Fetching detailed inquiry bookings report");
        return bookingServiceClient.getInquiries();
    }

    public List<BookingResponse> getPendingBookings() {
        log.info("Fetching detailed pending bookings report");
        return bookingServiceClient.getPendingBookings();
    }

    public List<BookingResponse> getAppPendingBookings() {
        log.info("Fetching detailed app pending bookings report");
        return bookingServiceClient.getAppPendingBookings();
    }

    public List<BookingResponse> getDispatchedBookings() {
        log.info("Fetching detailed dispatched bookings report");
        return bookingServiceClient.getDispatchedBookings();
    }

    public List<BookingResponse> getEnrouteBookings() {
        log.info("Fetching detailed enroute bookings report");
        return bookingServiceClient.getEnrouteBookings();
    }

    public List<BookingResponse> getWaitingBookings() {
        log.info("Fetching detailed waiting for customer bookings report");
        return bookingServiceClient.getWaitingBookings();
    }

    public List<BookingResponse> getPassengerOnboardBookings() {
        log.info("Fetching detailed passenger onboard bookings report");
        return bookingServiceClient.getPassengerOnboardBookings();
    }

    public List<BookingResponse> getCompletedBookings() {
        log.info("Fetching detailed completed bookings report");
        return bookingServiceClient.getCompletedHires();
    }

    public List<BookingResponse> getCancelledBookings() {
        log.info("Fetching detailed cancelled bookings report");
        return bookingServiceClient.getCancelledHires();
    }

    public List<VehicleResponse> getVehicleDetails() {
        return vehicleServiceClient.getVehicles();
    }

    public List<DriverResponse> getDriverDetails() {
        return driverServiceClient.getDrivers(false); // Get all drivers
    }

    public List<VehicleModelResponse> getVehicleModels() {
        return vehicleServiceClient.getVehicleModels();
    }

    public List<VehicleClassResponse> getVehicleClasses() {
        return vehicleServiceClient.getVehicleClasses();
    }

    public List<VehicleMakeResponse> getVehicleMakes() {
        return vehicleServiceClient.getVehicleMakes();
    }
}