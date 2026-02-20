package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Integer id;
    private String bookingId;
    private String customerName;
    private String contactNumber;
    private String pickupAddress;
    private String dropAddress;
    private String vehicleClassName;
    private String vehicleClassCode;
    private LocalDateTime bookingTime;
    private String status; // Kept as String to avoid Enum mismatch issues
}