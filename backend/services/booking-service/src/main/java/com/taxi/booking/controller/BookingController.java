package com.taxi.booking.controller;

import com.taxi.booking.dto.request.*;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import com.taxi.booking.service.CsvExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final CsvExportService csvExportService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {
        log.info("POST /api/bookings - Creating new booking");
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/bookings
     * UPDATED: Now supports startDate and endDate filtering
     * 
     * Query params:
     * - searchTerm: search string
     * - filterBy: customerName, phone, bookingId
     * - vehicleClassId: filter by vehicle class
     * - status: filter by status
     * - startDate: filter from date (yyyy-MM-dd)
     * - endDate: filter to date (yyyy-MM-dd)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String filterBy,
            @RequestParam(required = false) Integer vehicleClassId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info(
                "GET /api/bookings - searchTerm: {}, filterBy: {}, "
                        + "vehicleClassId: {}, status: {}, startDate: {}, endDate: {}",
                searchTerm, filterBy, vehicleClassId, status, startDate, endDate);

        List<BookingResponse> bookings;

        // --- Priority 1: Text Search ---
        if (searchTerm != null && !searchTerm.trim().isEmpty()
                && filterBy != null) {
            bookings = bookingService.searchBookings(filterBy, searchTerm);
        }
        // --- Priority 2: Status Filter ---
        else if (status != null) {
            bookings = bookingService.getBookingsByStatus(status, true);
        }
        // --- Priority 3: All ---
        else {
            bookings = bookingService.getAllBookings();
        }

        // --- Post-filter: Vehicle Class ---
        if (vehicleClassId != null) {
            bookings = bookings.stream()
                    .filter(b -> vehicleClassId.equals(b.getVehicleClassId()))
                    .toList();
        }

        // --- Post-filter: Date Range ---
        if (startDate != null || endDate != null) {
            final LocalDate effectiveStart = startDate != null
                    ? startDate
                    : LocalDate.of(2000, 1, 1);
            final LocalDate effectiveEnd = endDate != null
                    ? endDate
                    : LocalDate.now();

            bookings = bookings.stream()
                    .filter(b -> {
                        if (b.getBookingTime() == null)
                            return false;
                        try {
                            LocalDate bookingDate = LocalDate.parse(
                                    b.getBookingTime().toString().substring(0, 10));
                            return !bookingDate.isBefore(effectiveStart)
                                    && !bookingDate.isAfter(effectiveEnd);
                        } catch (Exception e) {
                            log.warn(
                                    "Could not parse booking date: {}",
                                    b.getBookingTime());
                            return true; // Include if unparseable
                        }
                    })
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }

    // ... rest of your endpoints remain unchanged ...

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Integer id) {
        log.info("GET /api/bookings/{} - Fetching booking", id);
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/booking-id/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingByBookingId(
            @PathVariable String bookingId) {
        log.info(
                "GET /api/bookings/booking-id/{} - Fetching booking", bookingId);
        BookingResponse booking = bookingService.getBookingByBookingId(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBookingRequest request) {
        log.info("PUT /api/bookings/{} - Updating booking", id);
        BookingResponse response = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Integer id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String changedByType,
            @RequestParam(required = false) Integer changedById) {
        log.info(
                "PUT /api/bookings/{}/status - Updating status to {}",
                id, status);
        BookingResponse response = bookingService.updateBookingStatus(
                id, status, changedByType, changedById);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/dispatch")
    public ResponseEntity<BookingResponse> dispatchBooking(
            @PathVariable Integer id,
            @Valid @RequestBody DispatchBookingRequest request) {
        log.info(
                "POST /api/bookings/{}/dispatch - Dispatching booking", id);
        BookingResponse response = bookingService.dispatchBooking(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Integer id,
            @Valid @RequestBody CompleteBookingRequest request) {
        log.info(
                "POST /api/bookings/{}/complete - Completing booking", id);
        BookingResponse response = bookingService.completeBooking(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Integer id,
            @Valid @RequestBody CancelBookingRequest request) {
        log.info(
                "POST /api/bookings/{}/cancel - Cancelling booking", id);
        bookingService.cancelBooking(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        log.info("DELETE /api/bookings/{} - Deleting booking", id);
        CancelBookingRequest cancelRequest = new CancelBookingRequest();
        cancelRequest.setCancellationReason("Deleted by admin");
        cancelRequest.setCancelledType("ADMIN_DELETED");
        cancelRequest.setCancelledByType("ADMIN");
        bookingService.cancelBooking(id, cancelRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportBookingsToCsv(
            @RequestParam(required = false) BookingStatus status)
            throws IOException {
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
        headers.setContentDispositionFormData(
                "attachment", "bookings_export.csv");
        return ResponseEntity.ok().headers(headers).body(csvData);
    }
}