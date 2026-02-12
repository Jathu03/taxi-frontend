// ========================
// Generic API Response
// ========================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
}

// ========================
// Fare Scheme Response
// ========================
export interface FareSchemeResponse {
  id: number;
  fareCode: string;
  fareName: string | null;
  description: string | null;
  vehicleClassId: number | null;
  isMetered: boolean;
  isPackage: boolean;
  minimumDistance: number | null;
  minimumRate: number | null;
  ratePerKm: number | null;
  freeWaitTime: number | null;
  waitingChargePerMin: number | null;
  peakHourStartTime: string | null; // "HH:mm:ss"
  peakHourEndTime: string | null;
  peakHourRateHike: number | null;
  offPeakMinRateHike: number | null;
  ratePerKmHike: number | null;
  minimumTime: number | null;
  additionalTimeSlot: number | null;
  ratePerAdditionalTimeSlot: number | null;
  nightStartTime: string | null;
  nightEndTime: string | null;
  nightRateHike: number | null;
  status: string; // "Active", "Inactive", etc.
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create/Update Requests
// ========================
export interface FareSchemeCreateRequest {
  fareCode: string;
  fareName?: string;
  description?: string;
  vehicleClassId?: number;
  isMetered?: boolean;
  isPackage?: boolean;
  minimumDistance?: number;
  minimumRate?: number;
  ratePerKm?: number;
  freeWaitTime?: number;
  waitingChargePerMin?: number;
  peakHourStartTime?: string;
  peakHourEndTime?: string;
  peakHourRateHike?: number;
  offPeakMinRateHike?: number;
  ratePerKmHike?: number;
  minimumTime?: number;
  additionalTimeSlot?: number;
  ratePerAdditionalTimeSlot?: number;
  nightStartTime?: string;
  nightEndTime?: string;
  nightRateHike?: number;
  status?: string;
}

export interface FareSchemeUpdateRequest {
  fareCode?: string;
  fareName?: string;
  description?: string;
  vehicleClassId?: number;
  isMetered?: boolean;
  isPackage?: boolean;
  minimumDistance?: number;
  minimumRate?: number;
  ratePerKm?: number;
  freeWaitTime?: number;
  waitingChargePerMin?: number;
  peakHourStartTime?: string;
  peakHourEndTime?: string;
  peakHourRateHike?: number;
  offPeakMinRateHike?: number;
  ratePerKmHike?: number;
  minimumTime?: number;
  additionalTimeSlot?: number;
  ratePerAdditionalTimeSlot?: number;
  nightStartTime?: string;
  nightEndTime?: string;
  nightRateHike?: number;
  status?: string;
}

// ========================
// Query Params
// ========================
export interface QueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  status?: string;
}