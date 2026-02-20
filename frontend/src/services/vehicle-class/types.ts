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
// Vehicle Class Response
// ========================
export interface VehicleClassResponse {
  id: number;
  className: string;
  classCode: string | null;
  categoryName: string | null;
  commissionRate: number | null;
  luggageCapacity: string | null;
  noOfSeats: number | null;
  description: string | null;
  showInApp: boolean;
  showInWeb: boolean;
  appOrder: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create/Update Requests
// ========================
// @/services/vehicle-class/types.ts
export interface VehicleClassCreateRequest {
  className: string;
  classCode?: string;
  commissionRate?: number;
  comments?: string;
  description?: string;
  luggageCapacity?: string;
  showInApp?: boolean;
  showInWeb?: boolean;
  appOrder?: number;
  noOfSeats?: number;
  classImage?: string;
  vehicleImagePrimary?: string;
  vehicleImageSecondary?: string;
  vehicleImageTertiary?: string;
  fareSchemeId?: number | null;
  corporateFareSchemeId?: number | null;
  roadTripFareSchemeId?: number | null;
  appFareSchemeId?: number | null;
}

export interface VehicleClassUpdateRequest {
  className?: string;
  classCode?: string;
  categoryId?: number;
  commissionRate?: number;
  luggageCapacity?: string;
  noOfSeats?: number;
  description?: string;
  showInApp?: boolean;
  showInWeb?: boolean;
  appOrder?: number;
  imageUrl?: string;
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
  isActive?: boolean;
}