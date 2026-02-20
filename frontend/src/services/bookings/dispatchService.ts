// src/services/bookings/dispatchService.ts

import axiosClient from "@/api/axiosClient";
import type { BookingResponse } from "@/services/bookings/types";

// =============================================================================
// TYPES (Matching Java DTOs)
// =============================================================================

export interface DispatchBookingRequest {
  driverId: number;
  vehicleId: number;
  dispatchedBy?: number;
  passengerName?: string;
  numberOfPassengers?: number;
  luggage?: number;
  remarks?: string;
  specialRemarks?: string;
  percentage?: number;
}

export interface DispatchedFilterParams {
  searchTerm?: string;
  driverId?: number;
  corporateId?: number;
}

export interface DriverOption {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  contactNumber: string;
  vehicleId: number | null;
  isActive: boolean;
}

export interface VehicleOption {
  id: number;
  vehicleCode: string;
  registrationNumber: string;
  modelName: string;
  className: string;
  isActive: boolean;
}

// =============================================================================
// HELPER: Universal Data Extractor
// =============================================================================

/**
 * Extracts the actual array from any backend response format:
 * 1. Plain Array:    [...]
 * 2. PagedResponse:  { content: [...], page: 0, size: 10 }
 * 3. ApiResponse:    { success: true, data: [...] }
 * 4. Nested Paged:   { success: true, data: { content: [...] } }
 */
function extractArray<T>(responseData: any): T[] {
  // Case 1: Already an array
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    // Case 2: PagedResponse -> { content: [...] }
    if (Array.isArray(responseData.content)) {
      return responseData.content;
    }

    // Case 3: ApiResponse -> { data: [...] }
    if (Array.isArray(responseData.data)) {
      return responseData.data;
    }

    // Case 4: ApiResponse wrapping PagedResponse -> { data: { content: [...] } }
    if (responseData.data && Array.isArray(responseData.data.content)) {
      return responseData.data.content;
    }
  }

  console.warn("Could not extract array from response:", responseData);
  return [];
}

// =============================================================================
// SERVICE
// =============================================================================

const BOOKING_URL = "/api/bookings";
const DISPATCHED_URL = "/api/bookings/dispatched";
const DRIVER_URL = "/api/drivers/active";
const VEHICLE_URL = "/api/vehicles";

export const dispatchService = {
  /**
   * GET /api/bookings/dispatched
   */
  getDispatchedBookings: async (params?: DispatchedFilterParams): Promise<BookingResponse[]> => {
    try {
      const response = await axiosClient.get(DISPATCHED_URL, { params });
      return extractArray<BookingResponse>(response.data);
    } catch (error) {
      console.error("Error fetching dispatched bookings:", error);
      return [];
    }
  },

  /**
   * POST /api/bookings/{id}/dispatch
   */
  dispatchBooking: async (id: number | string, data: DispatchBookingRequest): Promise<void> => {
    await axiosClient.post(`${BOOKING_URL}/${id}/dispatch`, data);
  },

  // --- Helper Methods for Dropdowns ---

  /**
   * GET /api/drivers/active
   * Backend returns PagedResponse: { content: [...], page: 0, size: 10 }
   */
  getActiveDrivers: async (): Promise<DriverOption[]> => {
    try {
      // Request a large page size to get all active drivers for dropdown
      const response = await axiosClient.get(DRIVER_URL, {
        params: { page: 0, size: 200 } // Get up to 200 drivers
      });
      return extractArray<DriverOption>(response.data);
    } catch (error) {
      console.error("Failed to fetch active drivers:", error);
      return [];
    }
  },

  /**
   * GET /api/vehicles/active
   * Backend may return ApiResponse: { success: true, data: [...] }
   * OR PagedResponse: { content: [...] }
   */
  getActiveVehicles: async (): Promise<VehicleOption[]> => {
    try {
      const response = await axiosClient.get(VEHICLE_URL, {
        params: { page: 0, size: 200 }
      });
      return extractArray<VehicleOption>(response.data);
    } catch (error) {
      console.error("Failed to fetch active vehicles:", error);
      return [];
    }
  }
};

export default dispatchService;