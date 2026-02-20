package com.taxi.booking.controller;

import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for App Pending Bookings
 * UI Endpoint: /admin/bookings/app-pending
 */
@RestController
@RequestMapping("/api/bookings/app-pending")
@RequiredArgsConstructor
@Slf4j
public class AppPendingBookingController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/app-pending
     * Get all app pending bookings (Android/iOS only)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAppPendingBookings(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) Integer vehicleClassId) {

        log.info("GET /api/bookings/app-pending - Fetching app pending bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.PENDING, true);

        // Filter only app bookings
        bookings = bookings.stream()
                .filter(b -> "ANDROID".equals(b.getAppPlatform()) || "IOS".equals(b.getAppPlatform()))
                .toList();

        // Apply platform filter
        if (platform != null) {
            bookings = bookings.stream()
                    .filter(b -> platform.equalsIgnoreCase(b.getAppPlatform()))
                    .toList();
        }

        // Apply vehicle class filter
        if (vehicleClassId != null) {
            bookings = bookings.stream()
                    .filter(b -> vehicleClassId.equals(b.getVehicleClassId()))
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }
}