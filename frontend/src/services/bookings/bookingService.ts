// src/services/bookings/bookingService.ts

import axiosClient from "@/api/axiosClient";
import type {
  BookingResponse,
  CreateBookingRequest,
  BookingSearchRequest,
  BookingStatus,
  VehicleClass,
  ApiResponse,
} from "./types";

const BOOKING_URL = "/api/bookings";

export const bookingService = {
  // ─────────────────────────────────────────────────────────────
  // Basic CRUD
  // ─────────────────────────────────────────────────────────────

  getAllBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosClient.get<BookingResponse[]>(BOOKING_URL);
    return response.data;
  },

  createBooking: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await axiosClient.post<BookingResponse>(BOOKING_URL, data);
    return response.data;
  },

  getBookingById: async (id: number): Promise<BookingResponse> => {
    const response = await axiosClient.get<BookingResponse>(`${BOOKING_URL}/${id}`);
    return response.data;
  },

  updateBooking: async (
    id: number,
    data: Partial<CreateBookingRequest>
  ): Promise<BookingResponse> => {
    const response = await axiosClient.put<BookingResponse>(`${BOOKING_URL}/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id: number, reason: string): Promise<void> => {
    const payload = {
      cancelledType: "ADMIN_CANCELLED",
      cancelledByType: "ADMIN",
      cancellationReason: reason,
    };
    await axiosClient.post(`${BOOKING_URL}/${id}/cancel`, payload);
  },

  // ─────────────────────────────────────────────────────────────
  // Searching / filtering (uses GET /api/bookings with query params)
  // ─────────────────────────────────────────────────────────────

  searchByTerm: async (filterBy: string, searchTerm: string): Promise<BookingResponse[]> => {
    const response = await axiosClient.get<BookingResponse[]>(BOOKING_URL, {
      params: { filterBy, searchTerm },
    });
    return response.data;
  },

  searchBookings: async (filters: BookingSearchRequest): Promise<BookingResponse[]> => {
    const params: Record<string, string | number | undefined> = {};

    if (filters.status && filters.status !== "all") params.status = filters.status;
    if (filters.vehicleClassId) params.vehicleClassId = filters.vehicleClassId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await axiosClient.get<BookingResponse[]>(BOOKING_URL, { params });
    return response.data;
  },

  /**
   * Combined search - sends ALL filters in one call as query params
   * Backend: GET /api/bookings
   */
  searchAll: async (params: {
    searchTerm?: string;
    filterBy?: string;
    status?: BookingStatus | string;
    vehicleClassId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<BookingResponse[]> => {
    const cleanParams: Record<string, string | number> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all") {
        cleanParams[key] = value as any;
      }
    });

    const response = await axiosClient.get<BookingResponse[]>(BOOKING_URL, {
      params: cleanParams,
    });
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // Specialized lists (your additional controllers)
  // ─────────────────────────────────────────────────────────────

  /**
   * Uses DispatchedBookingController:
   * GET /api/bookings/dispatched
   */
  getDispatchedBookings: async (params?: {
    searchTerm?: string;
    driverId?: number;
    corporateId?: number;
  }): Promise<BookingResponse[]> => {
    const response = await axiosClient.get<BookingResponse[]>(`${BOOKING_URL}/dispatched`, {
      params: {
        searchTerm: params?.searchTerm,
        driverId: params?.driverId,
        corporateId: params?.corporateId,
      },
    });
    return response.data;
  },

  /**
   * Uses ManualDispatchController:
   * GET /api/bookings/manual-dispatch
   */
  getManualDispatchedBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosClient.get<BookingResponse[]>(`${BOOKING_URL}/manual-dispatch`);
    return response.data;
  },

  /**
   * If you have PendingBookingController:
   * GET /api/bookings/pending
   * (optional helper; your pendingService already uses this endpoint)
   */
  getPendingBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosClient.get<BookingResponse[]>(`${BOOKING_URL}/pending`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: BookingStatus,
    changedByType: string = "USER",
    changedById?: number
  ): Promise<BookingResponse> => {
    const response = await axiosClient.put<BookingResponse>(`${BOOKING_URL}/${id}/status`, null, {
      params: { status, changedByType, changedById },
    });
    return response.data;
  },

  completeBooking: async (id: number, data: any): Promise<BookingResponse> => {
    const response = await axiosClient.post<BookingResponse>(`${BOOKING_URL}/${id}/complete`, data);
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // Supporting data
  // ─────────────────────────────────────────────────────────────

  getVehicleClasses: async (): Promise<VehicleClass[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<VehicleClass[]>>("/api/vehicle-classes");
      if (response.data?.success) return response.data.data;
      return [];
    } catch (error) {
      console.warn("Vehicle Class API error:", error);
      return [];
    }
  },

  getInquiries: async (): Promise<BookingResponse[]> => {
    try {
      const response = await axiosClient.get<BookingResponse[]>(`${BOOKING_URL}/inquiries`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
      return [];
    }
  },
};