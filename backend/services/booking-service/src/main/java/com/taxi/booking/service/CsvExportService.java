package com.taxi.booking.service;

import com.taxi.booking.dto.response.BookingResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

/**
 * Service for exporting booking data to CSV format
 */
@Service
@Slf4j
public class CsvExportService {

    /**
     * Export bookings to CSV
     */
    public byte[] exportBookingsToCsv(List<BookingResponse> bookings) throws IOException {
        log.debug("Exporting {} bookings to CSV", bookings.size());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);

        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(
                        "Booking ID", "Customer Name", "Phone Number", "Pickup Location",
                        "Drop Location", "Vehicle Type", "Booking Time", "Status")
                .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, csvFormat)) {
            for (BookingResponse booking : bookings) {
                csvPrinter.printRecord(
                        booking.getBookingId(),
                        booking.getCustomerName(),
                        booking.getContactNumber(),
                        booking.getPickupAddress(),
                        booking.getDropAddress(),
                        booking.getVehicleClassName(),
                        booking.getBookingTime(),
                        booking.getStatus());
            }
            csvPrinter.flush();
        }

        return out.toByteArray();
    }

    /**
     * Export completed hires to CSV with detailed information
     */
    public byte[] exportCompletedHiresToCsv(List<BookingResponse> bookings) throws IOException {
        log.debug("Exporting {} completed hires to CSV", bookings.size());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);

        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(
                        "Booking", "Voucher", "Org", "Customer", "Passenger", "Hire Type",
                        "Booking Time", "Booked By", "Pickup Time", "Pickup Address",
                        "Dispatched Time", "Dispatched By", "Start Time", "Completed Time",
                        "Total Distance", "Total Fare", "Waiting Time", "Billed Wait Time",
                        "Waiting Fee", "Test Booking", "Driver", "Vehicle", "Fare Scheme")
                .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, csvFormat)) {
            for (BookingResponse booking : bookings) {
                csvPrinter.printRecord(
                        booking.getBookingId(),
                        booking.getVoucherNumber(),
                        booking.getCorporateName(),
                        booking.getCustomerName(),
                        booking.getPassengerName(),
                        booking.getHireType(),
                        booking.getBookingTime(),
                        booking.getBookedByName(),
                        booking.getPickupTime(),
                        booking.getPickupAddress(),
                        booking.getDispatchedTime(),
                        booking.getDispatchedByName(),
                        booking.getStartTime(),
                        booking.getCompletedTime(),
                        booking.getTotalDistance(),
                        booking.getTotalFare(),
                        booking.getTotalWaitTime(),
                        booking.getBilledWaitTime(),
                        booking.getTotalWaitingFee(),
                        booking.getIsTestBooking() ? "Yes" : "No",
                        booking.getDriverName(),
                        booking.getVehicleRegistrationNumber(),
                        booking.getFareSchemeName());
            }
            csvPrinter.flush();
        }

        return out.toByteArray();
    }

    /**
     * Export cancelled hires to CSV
     */
    public byte[] exportCancelledHiresToCsv(List<BookingResponse> bookings) throws IOException {
        log.debug("Exporting {} cancelled hires to CSV", bookings.size());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);

        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(
                        "Booking #", "Org", "Customer", "Passenger #", "Hire Type",
                        "Booking Time", "Test Booking", "Cancelled Time", "Cancelled Type",
                        "Cancelled Agent", "Driver", "Vehicle")
                .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, csvFormat)) {
            for (BookingResponse booking : bookings) {
                csvPrinter.printRecord(
                        booking.getBookingId(),
                        booking.getCorporateName(),
                        booking.getCustomerName(),
                        booking.getNumberOfPassengers(),
                        booking.getHireType(),
                        booking.getBookingTime(),
                        booking.getIsTestBooking() ? "Yes" : "No",
                        booking.getUpdatedAt(),
                        "N/A", // Cancelled type - would need to join with cancellation
                        "N/A", // Cancelled agent
                        booking.getDriverName(),
                        booking.getVehicleRegistrationNumber());
            }
            csvPrinter.flush();
        }

        return out.toByteArray();
    }
}