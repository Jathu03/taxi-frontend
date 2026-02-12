package com.taxi.booking.controller;

import com.taxi.booking.dto.request.CreateBookingRequest;
import com.taxi.booking.dto.request.DispatchBookingRequest;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for TUK Bookings
 * Similar to regular bookings but filtered by TUK vehicle class
 * UI Endpoints: Same structure as regular bookings but for TUK
 */
@RestController
@RequestMapping("/api/tuk-bookings")
@RequiredArgsConstructor
@Slf4j
public class TukBookingController {

    private final BookingService bookingService;

    // TUK vehicle class ID (from database: class_code = 'TUK')
    // This should ideally come from configuration or vehicle service
    private static final String TUK_CLASS_CODE = "TUK";

    /**
     * POST /api/tuk-bookings
     * Create a new TUK booking
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createTukBooking(@Valid @RequestBody CreateBookingRequest request) {
        log.info("POST /api/tuk-bookings - Creating new TUK booking");

        // Ensure vehicle class is TUK (you might need to validate this with Vehicle
        // Service)
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/tuk-bookings/pending
     * Get pending TUK bookings
     */
    @GetMapping("/pending")
    public ResponseEntity<List<BookingResponse>> getPendingTukBookings() {
        log.info("GET /api/tuk-bookings/pending - Fetching pending TUK bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.PENDING, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/completed
     * Get completed TUK hires
     */
    @GetMapping("/completed")
    public ResponseEntity<List<BookingResponse>> getCompletedTukHires() {
        log.info("GET /api/tuk-bookings/completed - Fetching completed TUK hires");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.COMPLETED, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/dispatched
     * Get dispatched TUK bookings
     */
    @GetMapping("/dispatched")
    public ResponseEntity<List<BookingResponse>> getDispatchedTukBookings() {
        log.info("GET /api/tuk-bookings/dispatched - Fetching dispatched TUK bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.DISPATCHED, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/enroute
     * Get enroute TUK bookings
     */
    @GetMapping("/enroute")
    public ResponseEntity<List<BookingResponse>> getEnrouteTukBookings() {
        log.info("GET /api/tuk-bookings/enroute - Fetching enroute TUK bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.ENROUTE, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/waiting
     * Get waiting for customer TUK bookings
     */
    @GetMapping("/waiting")
    public ResponseEntity<List<BookingResponse>> getWaitingTukBookings() {
        log.info("GET /api/tuk-bookings/waiting - Fetching waiting TUK bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.WAITING_FOR_CUSTOMER, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/onboard
     * Get passenger onboard TUK bookings
     */
    @GetMapping("/onboard")
    public ResponseEntity<List<BookingResponse>> getOnboardTukBookings() {
        log.info("GET /api/tuk-bookings/onboard - Fetching onboard TUK bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.PASSENGER_ONBOARD, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/tuk-bookings/cancelled
     * Get cancelled TUK hires
     */
    @GetMapping("/cancelled")
    public ResponseEntity<List<BookingResponse>> getCancelledTukHires() {
        log.info("GET /api/tuk-bookings/cancelled - Fetching cancelled TUK hires");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.CANCELLED, true);

        // Filter only TUK bookings
        bookings = bookings.stream()
                .filter(b -> TUK_CLASS_CODE.equals(b.getVehicleClassCode()))
                .toList();

        return ResponseEntity.ok(bookings);
    }
}