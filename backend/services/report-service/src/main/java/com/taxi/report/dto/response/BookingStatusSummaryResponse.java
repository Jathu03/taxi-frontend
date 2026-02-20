package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusSummaryResponse {
    private long inquiryCount;
    private long pendingCount;
    private long appPendingCount;
    private long dispatchedCount;
    private long enrouteCount;
    private long waitingForCustomerCount;
    private long passengerOnboardCount;
    private long completedCount;
    private long cancelledCount;
}