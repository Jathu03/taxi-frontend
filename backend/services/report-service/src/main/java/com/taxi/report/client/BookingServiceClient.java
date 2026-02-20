package com.taxi.report.client;

import com.taxi.report.dto.response.BookingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "booking-service", url = "${service.urls.booking-service}")
public interface BookingServiceClient {

        @GetMapping("/api/bookings/inquiries")
        List<BookingResponse> getInquiries();

        // Matches PendingBookingController in booking-service
        @GetMapping("/api/bookings/pending")
        List<BookingResponse> getPendingBookings();

        // Matches AppPendingBookingController in booking-service
        @GetMapping("/api/bookings/app-pending")
        List<BookingResponse> getAppPendingBookings();

        // Matches DispatchedBookingController in booking-service
        @GetMapping("/api/bookings/dispatched")
        List<BookingResponse> getDispatchedBookings();

        // Matches EnrouteBookingController
        @GetMapping("/api/bookings/enroute")
        List<BookingResponse> getEnrouteBookings();

        // Matches WaitingForCustomerController
        @GetMapping("/api/bookings/waiting-for-customer")
        List<BookingResponse> getWaitingBookings();

        // Matches PassengerOnboardController
        @GetMapping("/api/bookings/passenger-onboard")
        List<BookingResponse> getPassengerOnboardBookings();

        // Matches CompletedHireController
        @GetMapping("/api/bookings/completed-hires")
        List<BookingResponse> getCompletedHires();

        // Matches CancelledHireController
        @GetMapping("/api/bookings/cancelled-hires")
        List<BookingResponse> getCancelledHires();
}