// src/services/bookings/pendingService.ts

import axiosClient from "@/api/axiosClient";
import type { BookingResponse } from "@/services/bookings/types";

export interface PendingBooking {
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
  originalData: BookingResponse;
}

export interface VehicleClassOption {
  id: number;
  name: string;
  code: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────

function extractArray(responseData: any): any[] {
  if (Array.isArray(responseData)) return responseData;
  if (responseData?.data && Array.isArray(responseData.data)) return responseData.data;
  if (responseData?.content && Array.isArray(responseData.content)) return responseData.content;
  return [];
}

function mapToRow(
  booking: BookingResponse,
  vehicleMap: Record<number, string>
): PendingBooking {
  const vehicleClassName =
    booking.vehicleClassName ||
    vehicleMap[booking.vehicleClassId] ||
    `Class #${booking.vehicleClassId || "N/A"}`;

  return {
    id: String(booking.id),
    bookingNumber: booking.bookingId,
    isAdvance: booking.isAdvanceBooking ? "Yes" : "No",
    organization: booking.corporateName || booking.bookingSource || "N/A",
    customer: booking.customerName,
    passengerNumber: booking.contactNumber,
    hireType: booking.hireType || "N/A",
    clientRemarks: booking.clientRemarks || booking.remarks || "",
    bookingTime: booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : "",
    bookedBy: booking.bookedByName || "System",
    pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toLocaleString() : "",
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress || "",
    vehicleClass: vehicleClassName,
    vehicleClassId: Number(booking.vehicleClassId) || 0,
    originalData: booking,
  };
}

// ─── Constants ────────────────────────────────────────────────────────

const TUK_CLASS_ID = 8;

/**
 * App booking detection:
 * Your earlier code required bookingSource === "MOBILE_APP" exactly.
 * In many systems, app bookings might come as:
 * - bookingSource: "MOBILE_APP" | "APP" | "MOBILE" | etc.
 * - OR bookingSource is null, but appPlatform is "ANDROID"/"IOS"
 */
const APP_SOURCE_MATCHERS = [
  "MOBILE_APP",
  "APP",
  "MOBILE",
  "ANDROID_APP",
  "IOS_APP",
  "ANDROID",
  "IOS",
];

function isMobileAppBooking(b: BookingResponse): boolean {
  const source = (b.bookingSource || "").toUpperCase().trim();
  const platform = (b.appPlatform || "").toUpperCase().trim();

  // 1) bookingSource indicates app
  if (source && APP_SOURCE_MATCHERS.some((s) => source.includes(s))) return true;

  // 2) appPlatform indicates app (common: ANDROID/IOS). Anything non-empty and not WEB is treated as App.
  if (platform && platform !== "WEB") return true;

  return false;
}

// ─── Service ──────────────────────────────────────────────────────────

export const pendingService = {
  /**
   * Fetch all vehicle classes for dropdown and name resolution
   */
  getVehicleClasses: async (): Promise<VehicleClassOption[]> => {
    try {
      const response = await axiosClient.get("/api/vehicle-classes");
      const raw = extractArray(response.data);

      return raw.map((vc: any) => ({
        id: vc.id,
        name: vc.className || vc.class_name || vc.name || "Unknown",
        code: vc.classCode || vc.class_code || vc.code || "",
      }));
    } catch (error) {
      console.warn("[PendingService] Failed to load vehicle classes:", error);
      return [];
    }
  },

  /**
   * 1) Standard Pending (Manual/Web/Phone)
   * Filter: (Not TUK) AND (NOT App booking)
   */
  getPendingBookings: async (
    vehicleMap: Record<number, string> = {}
  ): Promise<PendingBooking[]> => {
    try {
      const response = await axiosClient.get("/api/bookings/pending");
      const allBookings: BookingResponse[] = extractArray(response.data);

      const filtered = allBookings.filter((b) => {
        const isTuk = Number(b.vehicleClassId) === TUK_CLASS_ID;
        const isApp = isMobileAppBooking(b);
        return !isTuk && !isApp;
      });

      return filtered.map((b) => mapToRow(b, vehicleMap));
    } catch (error) {
      console.error("[PendingService] API Error:", error);
      return [];
    }
  },

  /**
   * 2) App Pending
   * Filter: (Not TUK) AND (IS App booking)
   */
  getAppPendingBookings: async (
  vehicleMap: Record<number, string> = {}
): Promise<PendingBooking[]> => {
  try {
    const response = await axiosClient.get("/api/bookings/pending");
    const allBookings: BookingResponse[] = extractArray(response.data);

    // ✅ DEBUG 1: Basic counts
    console.log("[AppPending] Total pending from API:", allBookings.length);

    // ✅ DEBUG 2: VehicleClassId distribution (unique + counts)
    const classIdCounts = allBookings.reduce<Record<string, number>>((acc, b) => {
      const key = String(b.vehicleClassId ?? "null");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    console.log("[AppPending] vehicleClassId counts:", classIdCounts);

    // ✅ DEBUG 3: Show a quick table (id, vehicleClassId, bookingSource, appPlatform, status)
    console.table(
      allBookings.slice(0, 50).map((b) => ({
        id: b.id,
        vehicleClassId: b.vehicleClassId,
        bookingSource: b.bookingSource,
        appPlatform: b.appPlatform,
        status: b.status,
      }))
    );

    // ✅ DEBUG 4: Unique bookingSource + appPlatform values
    const uniqueSources = [...new Set(allBookings.map((b) => (b.bookingSource ?? "null")))];
    const uniquePlatforms = [...new Set(allBookings.map((b) => (b.appPlatform ?? "null")))];
    console.log("[AppPending] unique bookingSource:", uniqueSources);
    console.log("[AppPending] unique appPlatform:", uniquePlatforms);

    const filtered = allBookings.filter((b) => {
      const isTuk = Number(b.vehicleClassId) === TUK_CLASS_ID;
      const isApp = isMobileAppBooking(b);
      return !isTuk && isApp;
    });

    // ✅ DEBUG 5: Result summary + show filtered rows too
    console.log("[AppPending] Filtered (non-TUK app) count:", filtered.length);
    console.table(
      filtered.slice(0, 50).map((b) => ({
        id: b.id,
        vehicleClassId: b.vehicleClassId,
        bookingSource: b.bookingSource,
        appPlatform: b.appPlatform,
        status: b.status,
      }))
    );

    return filtered.map((b) => mapToRow(b, vehicleMap));
  } catch (error) {
    console.error("[PendingService] API Error:", error);
    return [];
  }
},
};

export default pendingService;