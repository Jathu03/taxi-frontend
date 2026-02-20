import axiosClient from "@/api/axiosClient";
import type { BookingResponse, CreateBookingRequest } from "@/services/bookings/types";

const INQUIRIES_URL = "/api/bookings/inquiries";
const BOOKING_URL = "/api/bookings";

// ─── Exported Types ─────────────────────────────────────────────────────────────

export type Inquiry = {
  id: string;
  inquiryNumber: string;
  org: string;
  customerName: string;
  passengerPhone: string;
  hireType: string;
  bookingTime: string;
  pickupAddress: string;
  vehicleClass: string;    // Display name from API
  vehicleClassId: number;  // RAW ID for Map Lookup
  customerId: string;
};

export type InquiryFilterParams = {
  filterBy?: string;
  searchTerm?: string;
  hireType?: string;
  corporateId?: number;
};

// ─── UI Label → Backend Enum Mappings ───────────────────────────────────────────

const BOOKING_SOURCE_MAP: Record<string, string> = {
  "Casons Taxi Website": "CASONS_TAXI_WEBSITE",
  "Cash Hire": "CASH_HIRE",
};

const HIRE_TYPE_MAP: Record<string, string> = {
  "On The Meter": "ON_THE_METER",
  "Special Package": "SPECIAL_PACKAGE",
};

const BOOKING_SOURCE_DISPLAY: Record<string, string> = {
  "CASONS_TAXI_WEBSITE": "Casons Taxi Website",
  "CASH_HIRE": "Cash Hire",
};

const HIRE_TYPE_DISPLAY: Record<string, string> = {
  "ON_THE_METER": "On The Meter",
  "SPECIAL_PACKAGE": "Special Package",
};

// ─── Mapper ─────────────────────────────────────────────────────────────────────

function mapBookingToInquiry(booking: BookingResponse): Inquiry {
  return {
    id: String(booking.id),
    inquiryNumber: booking.bookingId,
    org: booking.bookingSource
      ? (BOOKING_SOURCE_DISPLAY[booking.bookingSource] ?? booking.bookingSource)
      : (booking.corporateName ?? ""),
    customerName: booking.customerName,
    passengerPhone: booking.contactNumber,
    hireType: booking.hireType
      ? (HIRE_TYPE_DISPLAY[booking.hireType] ?? booking.hireType)
      : "",
    bookingTime: booking.bookingTime ? String(booking.bookingTime) : "",
    pickupAddress: booking.pickupAddress ?? "",
    vehicleClass: booking.vehicleClassName ?? "",
    vehicleClassId: booking.vehicleClassId || 0, // CRITICAL: Keep ID for frontend lookup
    customerId: booking.corporateId
      ? String(booking.corporateId)
      : String(booking.id),
  };
}

const FILTER_BY_MAP: Record<string, string> = {
  passengerPhone: "phone",
  customerName: "customername",
  inquiryNumber: "bookingid",
};

// ─── Service ────────────────────────────────────────────────────────────────────

export const inquiriesService = {
  getInquiries: async (params?: InquiryFilterParams): Promise<Inquiry[]> => {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.filterBy && params?.searchTerm) {
        queryParams.filterBy = FILTER_BY_MAP[params.filterBy] ?? params.filterBy;
        queryParams.searchTerm = params.searchTerm;
      }
      if (params?.hireType && params.hireType !== "all") {
        queryParams.hireType = HIRE_TYPE_MAP[params.hireType] ?? params.hireType;
      }
      if (params?.corporateId) {
        queryParams.corporateId = String(params.corporateId);
      }

      const response = await axiosClient.get<BookingResponse[]>(INQUIRIES_URL, { params: queryParams });
      return response.data.map(mapBookingToInquiry);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      return [];
    }
  },

  getInquiryById: async (id: number): Promise<Inquiry> => {
    const response = await axiosClient.get<BookingResponse>(`${BOOKING_URL}/${id}`);
    return mapBookingToInquiry(response.data);
  },

  createInquiry: async (values: Partial<Inquiry>, vehicleClassId: number = 0): Promise<Inquiry> => {
    const bookingSource = values.org ? (BOOKING_SOURCE_MAP[values.org] ?? values.org) : undefined;
    const hireType = values.hireType ? (HIRE_TYPE_MAP[values.hireType] ?? values.hireType) : undefined;

    const request: CreateBookingRequest = {
      customerName: values.customerName ?? "",
      contactNumber: values.passengerPhone ?? "",
      pickupAddress: values.pickupAddress ?? "",
      hireType: hireType,
      bookingSource: bookingSource,
      vehicleClassId: vehicleClassId,
      isInquiryOnly: true,
    };

    const response = await axiosClient.post<BookingResponse>(BOOKING_URL, request);
    return mapBookingToInquiry(response.data);
  },

  cancelInquiry: async (id: string, reason: string = "Cancelled from inquiries page"): Promise<void> => {
    await axiosClient.post(`${BOOKING_URL}/${id}/cancel`, {
      cancelledType: "ADMIN_CANCELLED",
      cancelledByType: "USER",
      cancellationReason: reason,
    });
  },

  bulkCancelInquiries: async (ids: string[], reason: string = "Bulk cancel from inquiries page"): Promise<void> => {
    await Promise.all(ids.map((id) => inquiriesService.cancelInquiry(id, reason)));
  },
};