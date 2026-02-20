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
// Vehicle Model Types
// ========================

export interface VehicleModelResponse {
  id: number;
  makeId: number;
  makeName: string;
  model: string;
  modelCode: string | null;
  frame: string | null;
  transmissionType: string | null;
  trimLevel: string | null;
  fuelType: string | null;
  turbo: string | null;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleModelCreateRequest {
  makeId: number;
  model: string;
  modelCode?: string;
  frame?: string;
  transmissionType?: string;
  trimLevel?: string;
  fuelType?: string;
  turbo?: string;
  comments?: string;
}

export interface VehicleModelUpdateRequest {
  makeId?: number;
  model?: string;
  modelCode?: string;
  frame?: string;
  transmissionType?: string;
  trimLevel?: string;
  fuelType?: string;
  turbo?: string;
  comments?: string;
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