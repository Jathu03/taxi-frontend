// src/services/bookings/cancelService.ts

import axiosClient from "@/api/axiosClient";
import type { BookingResponse } from "@/services/bookings/types";

// =============================================================================
// TYPES
// =============================================================================

export interface CancelBookingRequest {
  cancellationReason: string;
  cancelledType?: string;      // e.g., "ADMIN_CANCELLED"
  cancelledByType?: string;    // e.g., "USER"
  cancelledByUserId?: number;  // ID of the admin performing the action
  cancelledByDriverId?: number;
  cancellationFee?: number;
}

// Matches Backend BookingCancellationResponse.java
export interface BookingCancellationResponse {
  id: number;
  bookingId: number;
  bookingNumber: string;
  cancelledTime: string; // ISO String
  cancelledType: string;
  cancelledByType: string;
  cancelledByUserId?: number;
  cancelledByUserName?: string;
  cancelledByDriverId?: number;
  cancelledByDriverName?: string;
  cancellationReason: string;
  cancellationFee: number;
  createdAt: string;
}

export interface CancelledHireFilterParams {
  filterBy?: string;
  searchTerm?: string;
  bookedBy?: number;
  hireType?: string;
  paymentType?: string;
  cancelledType?: string;
  corporateId?: number;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// SERVICE
// =============================================================================

const BOOKING_BASE_URL = "/api/bookings";
const CANCELLED_HIRES_URL = "/api/bookings/cancelled-hires";

export const cancelService = {
  /**
   * 1. ACTION: Cancel a booking
   * POST /api/bookings/{id}/cancel
   */
  cancelBooking: async (id: number | string, data: CancelBookingRequest): Promise<void> => {
    await axiosClient.post(`${BOOKING_BASE_URL}/${id}/cancel`, data);
  },

  /**
   * 2. DATA: Get general booking details (for the form fields)
   * GET /api/bookings/{id}
   */
  getBookingDetails: async (id: number | string): Promise<BookingResponse> => {
    const response = await axiosClient.get<BookingResponse>(`${BOOKING_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * 3. DATA: Get details about the cancellation (Reason, Agent, Time)
   * Uses the search capability of CancelledHireController to find specific record
   */
  getCancellationDetails: async (bookingIdOrNumber: string): Promise<BookingCancellationResponse | undefined> => {
    // We use the search endpoint to find this specific booking in the cancelled list
    const response = await axiosClient.get<BookingCancellationResponse[]>(CANCELLED_HIRES_URL, {
      params: {
        filterBy: "phone", // Using phone filter hack or prefer 'bookingId' if backend supports
        searchTerm: bookingIdOrNumber
      }
    });
    
    // Find exact match
    return response.data.find(c => 
      String(c.bookingId) === bookingIdOrNumber || 
      c.bookingNumber === bookingIdOrNumber
    );
  },

  /**
   * 4. LIST: Get all cancelled hires (For the Table View Page, if needed)
   */
  getAllCancelledHires: async (params?: CancelledHireFilterParams): Promise<BookingCancellationResponse[]> => {
    const response = await axiosClient.get<BookingCancellationResponse[]>(CANCELLED_HIRES_URL, { params });
    return response.data;
  }
};

export default cancelService;