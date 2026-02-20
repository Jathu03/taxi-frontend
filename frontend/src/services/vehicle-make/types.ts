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
// Vehicle Make (Manufacturer) Types
// ========================

export interface VehicleMakeResponse {
  id: number;
  manufacturer: string;
  manufacturerCode: string | null;
  modelCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleMakeCreateRequest {
  manufacturer: string;
  manufacturerCode?: string;
}

export interface VehicleMakeUpdateRequest {
  manufacturer?: string;
  manufacturerCode?: string;
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
}