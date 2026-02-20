// src/services/bookings/tukPendingService.ts

import axiosClient from "@/api/axiosClient";
import type { BookingResponse } from "@/services/bookings/types";

// =============================================================================
// TYPES
// =============================================================================

export interface TukPendingBooking {
  id: string;
  bookingNumber: string;
  isAdvance: string;
  organization: string;
  customer: string;
  passengerNumber: string;
  hireType: string;
  clientRemarks: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dropAddress: string;
  vehicleClass: string;
  vehicleClassId: number;
  bookingSource: string;
  originalData: BookingResponse;
}

export interface TukPendingFilterParams {
  searchTerm?: string;
  // keep this if your backend supports it; otherwise it will be ignored safely
  vehicleClass?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PENDING_BOOKINGS_URL = "/api/bookings/pending";
const TUK_CLASS_ID = 8;
const MOBILE_APP_SOURCE = "MOBILE_APP";

// =============================================================================
// HELPERS
// =============================================================================

function extractArray(responseData: any): BookingResponse[] {
  if (Array.isArray(responseData)) return responseData;
  if (responseData?.data && Array.isArray(responseData.data)) return responseData.data;
  if (responseData?.content && Array.isArray(responseData.content)) return responseData.content;
  return [];
}

function toLocal(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function isTukBooking(b: BookingResponse): boolean {
  // Prefer ID match (most reliable)
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return true;

  // Fallback if vehicleClassId missing but name exists
  const name = (b.vehicleClassName || "").toUpperCase();
  return name.includes("TUK");
}

function isMobileAppBooking(b: BookingResponse): boolean {
  return (b.bookingSource || "").toUpperCase().trim() === MOBILE_APP_SOURCE;
}

function mapResponseToTukBooking(booking: BookingResponse): TukPendingBooking {
  return {
    id: String(booking.id),
    bookingNumber: booking.bookingId,
    isAdvance: booking.isAdvanceBooking ? "Yes" : "No",
    organization: booking.corporateName || booking.bookingSource || "N/A",
    customer: booking.customerName || "N/A",
    passengerNumber: booking.contactNumber || "N/A",
    hireType: booking.hireType || "N/A",
    clientRemarks: booking.clientRemarks || booking.remarks || "",
    bookingTime: toLocal(booking.bookingTime),
    bookedBy: booking.bookedByName || "System",
    pickupTime: toLocal(booking.pickupTime),
    pickupAddress: booking.pickupAddress || "",
    dropAddress: booking.dropAddress || "",
    vehicleClass: booking.vehicleClassName || "TUK",
    vehicleClassId: Number(booking.vehicleClassId) || 0,
    bookingSource: booking.bookingSource || "",
    originalData: booking,
  };
}

// Optional: small local search (only if backend doesn't filter)
function matchesSearchTerm(b: BookingResponse, term?: string): boolean {
  if (!term || !term.trim()) return true;
  const t = term.toLowerCase();

  const customer = (b.customerName || "").toLowerCase();
  const phone = (b.contactNumber || "").toLowerCase();
  const bookingId = (b.bookingId || "").toLowerCase();
  const org = (b.corporateName || b.bookingSource || "").toLowerCase();

  return (
    customer.includes(t) ||
    phone.includes(t) ||
    bookingId.includes(t) ||
    org.includes(t)
  );
}

// =============================================================================
// SERVICE
// =============================================================================

export const tukPendingService = {
  /**
   * Tuk Pending (NON App)
   * Rule: TUK + NOT MOBILE_APP
   */
  getTukPendingBookings: async (
    params?: TukPendingFilterParams
  ): Promise<TukPendingBooking[]> => {
    try {
      const response = await axiosClient.get(PENDING_BOOKINGS_URL, { params });
      const allBookings = extractArray(response.data);

      const filtered = allBookings
        .filter(isTukBooking)
        .filter((b) => !isMobileAppBooking(b))
        .filter((b) => matchesSearchTerm(b, params?.searchTerm));

      return filtered.map(mapResponseToTukBooking);
    } catch (error) {
      console.error("[TukPendingService] Error fetching Tuk pending bookings:", error);
      throw error;
    }
  },

  /**
   * Tuk Pending (App)
   * Rule: TUK + MOBILE_APP
   */
  getTukAppPendingBookings: async (
    params?: TukPendingFilterParams
  ): Promise<TukPendingBooking[]> => {
    try {
      const response = await axiosClient.get(PENDING_BOOKINGS_URL, { params });
      const allBookings = extractArray(response.data);

      const filtered = allBookings
        .filter(isTukBooking)
        .filter((b) => isMobileAppBooking(b))
        .filter((b) => matchesSearchTerm(b, params?.searchTerm));

      return filtered.map(mapResponseToTukBooking);
    } catch (error) {
      console.error("[TukPendingService] Error fetching Tuk APP pending bookings:", error);
      throw error;
    }
  },
};

export default tukPendingService;