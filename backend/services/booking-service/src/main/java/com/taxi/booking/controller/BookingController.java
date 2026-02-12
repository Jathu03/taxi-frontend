package com.taxi.booking.controller;

import com.taxi.booking.dto.request.*;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import com.taxi.booking.service.CsvExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for main Booking operations
 * Handles CRUD operations and general booking management
 * UI Endpoints: /admin/bookings/add, /admin/bookings/manage
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final CsvExportService csvExportService;

    /**
     * POST /api/bookings
     * Create a new booking
     * Used by: /admin/bookings/add
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        log.info("POST /api/bookings - Creating new booking");
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/bookings
     * Get all bookings with optional search
     * Used by: /admin/bookings/manage
     * Query params:
     * - searchTerm: search string
     * - filterBy: customerName, phone, bookingId
     * - vehicleClassId: filter by vehicle class
     * - status: filter by status
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String filterBy,
            @RequestParam(required = false) Integer vehicleClassId,
            @RequestParam(required = false) BookingStatus status) {

        log.info("GET /api/bookings - searchTerm: {}, filterBy: {}, vehicleClassId: {}, status: {}",
                searchTerm, filterBy, vehicleClassId, status);

        List<BookingResponse> bookings;

        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterBy != null) {
            bookings = bookingService.searchBookings(filterBy, searchTerm);
        } else if (status != null) {
            bookings = bookingService.getBookingsByStatus(status, true);
        } else {
            bookings = bookingService.getAllBookings();
        }

        // Filter by vehicle class if provided
        if (vehicleClassId != null) {
            bookings = bookings.stream()
                    .filter(b -> vehicleClassId.equals(b.getVehicleClassId()))
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/bookings/{id}
     * Get booking by ID
     * Used by: /admin/bookings/view/{id}, /admin/bookings/edit/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Integer id) {
        log.info("GET /api/bookings/{} - Fetching booking", id);
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    /**
     * GET /api/bookings/booking-id/{bookingId}
     * Get booking by booking ID
     */
    @GetMapping("/booking-id/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingByBookingId(@PathVariable String bookingId) {
        log.info("GET /api/bookings/booking-id/{} - Fetching booking", bookingId);
        BookingResponse booking = bookingService.getBookingByBookingId(bookingId);
        return ResponseEntity.ok(booking);
    }

    /**
     * PUT /api/bookings/{id}
     * Update booking
     * Used by: /admin/bookings/edit/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBookingRequest request) {

        log.info("PUT /api/bookings/{} - Updating booking", id);
        BookingResponse response = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/bookings/{id}/status
     * Update booking status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Integer id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String changedByType,
            @RequestParam(required = false) Integer changedById) {

        log.info("PUT /api/bookings/{}/status - Updating status to {}", id, status);
        BookingResponse response = bookingService.updateBookingStatus(id, status, changedByType, changedById);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/bookings/{id}/dispatch
     * Dispatch booking to driver/vehicle
     * Used by: /admin/bookings/dispatch/{id}
     */
    @PostMapping("/{id}/dispatch")
    public ResponseEntity<BookingResponse> dispatchBooking(
            @PathVariable Integer id,
            @Valid @RequestBody DispatchBookingRequest request) {

        log.info("POST /api/bookings/{}/dispatch - Dispatching booking", id);
        BookingResponse response = bookingService.dispatchBooking(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/bookings/{id}/complete
     * Complete booking
     * Used by: /admin/bookings/complete-booking
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Integer id,
            @Valid @RequestBody CompleteBookingRequest request) {

        log.info("POST /api/bookings/{}/complete - Completing booking", id);
        BookingResponse response = bookingService.completeBooking(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/bookings/{id}/cancel
     * Cancel booking
     * Used by: /admin/bookings/cancel/{id}
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Integer id,
            @Valid @RequestBody CancelBookingRequest request) {

        log.info("POST /api/bookings/{}/cancel - Cancelling booking", id);
        bookingService.cancelBooking(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/bookings/{id}
     * Delete booking (only for inquiries or pending)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        log.info("DELETE /api/bookings/{} - Deleting booking", id);

        // Use cancel with a delete reason
        CancelBookingRequest cancelRequest = new CancelBookingRequest();
        cancelRequest.setCancellationReason("Deleted by admin");
        cancelRequest.setCancelledType("ADMIN_DELETED");
        cancelRequest.setCancelledByType("ADMIN");

        bookingService.cancelBooking(id, cancelRequest);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/bookings/export/csv
     * Export bookings to CSV
     * Used by: /admin/bookings/manage (Export button)
     */
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportBookingsToCsv(
            @RequestParam(required = false) BookingStatus status) throws IOException {

        log.info("GET /api/bookings/export/csv - Exporting bookings");

        List<BookingResponse> bookings;
        if (status != null) {
            bookings = bookingService.getBookingsByStatus(status, true);
        } else {
            bookings = bookingService.getAllBookings();
        }

        byte[] csvData = csvExportService.exportBookingsToCsv(bookings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "bookings_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}