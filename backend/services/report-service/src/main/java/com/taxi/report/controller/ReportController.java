package com.taxi.report.controller;

import com.taxi.report.dto.response.*;
import com.taxi.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/booking-status-summary")
    public ResponseEntity<BookingStatusSummaryResponse> getBookingStatusSummary() {
        return ResponseEntity.ok(reportService.getBookingStatusSummary());
    }

    @GetMapping("/bookings/inquiries")
    public ResponseEntity<List<BookingResponse>> getInquiryBookings() {
        return ResponseEntity.ok(reportService.getInquiryBookings());
    }

    @GetMapping("/bookings/pending")
    public ResponseEntity<List<BookingResponse>> getPendingBookings() {
        return ResponseEntity.ok(reportService.getPendingBookings());
    }

    @GetMapping("/bookings/app-pending")
    public ResponseEntity<List<BookingResponse>> getAppPendingBookings() {
        return ResponseEntity.ok(reportService.getAppPendingBookings());
    }

    @GetMapping("/bookings/dispatched")
    public ResponseEntity<List<BookingResponse>> getDispatchedBookings() {
        return ResponseEntity.ok(reportService.getDispatchedBookings());
    }

    @GetMapping("/bookings/enroute")
    public ResponseEntity<List<BookingResponse>> getEnrouteBookings() {
        return ResponseEntity.ok(reportService.getEnrouteBookings());
    }

    @GetMapping("/bookings/waiting")
    public ResponseEntity<List<BookingResponse>> getWaitingBookings() {
        return ResponseEntity.ok(reportService.getWaitingBookings());
    }

    @GetMapping("/bookings/onboard")
    public ResponseEntity<List<BookingResponse>> getPassengerOnboardBookings() {
        return ResponseEntity.ok(reportService.getPassengerOnboardBookings());
    }

    @GetMapping("/bookings/completed")
    public ResponseEntity<List<BookingResponse>> getCompletedBookings() {
        return ResponseEntity.ok(reportService.getCompletedBookings());
    }

    @GetMapping("/bookings/cancelled")
    public ResponseEntity<List<BookingResponse>> getCancelledBookings() {
        return ResponseEntity.ok(reportService.getCancelledBookings());
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleResponse>> getVehicleDetails() {
        return ResponseEntity.ok(reportService.getVehicleDetails());
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverResponse>> getDriverDetails() {
        return ResponseEntity.ok(reportService.getDriverDetails());
    }

    @GetMapping("/vehicle-models")
    public ResponseEntity<List<VehicleModelResponse>> getVehicleModels() {
        return ResponseEntity.ok(reportService.getVehicleModels());
    }

    @GetMapping("/vehicle-classes")
    public ResponseEntity<List<VehicleClassResponse>> getVehicleClasses() {
        return ResponseEntity.ok(reportService.getVehicleClasses());
    }

    @GetMapping("/vehicle-makes")
    public ResponseEntity<List<VehicleMakeResponse>> getVehicleMakes() {
        return ResponseEntity.ok(reportService.getVehicleMakes());
    }
}