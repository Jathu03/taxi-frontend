// ========================
// Enums / Constants
// ========================
// Matches com.taxi.vehicle.enums.FuelType
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

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
// Vehicle Response
// ========================
export interface VehicleResponse {
  id: number;
  vehicleCode: string;
  registrationNumber: string;
  chassisNumber: string | null;
  // Note: Backend sends ISO String or yyyy-MM-dd
  registrationDate: string | null;
  revenueLicenseNumber: string | null;
  revenueLicenseExpiryDate: string | null;
  passengerCapacity: number | null;
  luggageCapacity: number | null;
  comments: string | null;
  manufactureYear: number | null;

  // Relations
  makeId: number | null;
  makeName: string | null;
  modelId: number | null;
  modelName: string | null;
  fuelType: FuelType | string | null; // Updated to use the Type
  insurerId: number | null;
  insurerName: string | null;
  insuranceNumber: string | null;
  insuranceExpiryDate: string | null;
  ownerId: number | null;
  ownerName: string | null;
  classId: number | null;
  className: string | null;
  companyId: number | null;
  companyName: string | null;
  fareSchemeId: number | null; // Matches backend .fareSchemeId()

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create/Update Requests
// ========================
export interface VehicleCreateRequest {
  vehicleCode: string;
  registrationNumber: string;
  chassisNumber?: string;
  // IMPORTANT: Send dates as "YYYY-MM-DD" string, not ISO with time
  registrationDate?: string; 
  revenueLicenseNumber?: string;
  revenueLicenseExpiryDate?: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
  comments?: string;
  manufactureYear?: number;
  makeId?: number;
  modelId?: number;
  fuelType?: FuelType | string; // Updated
  insurerId?: number;
  insuranceNumber?: string;
  insuranceExpiryDate?: string;
  ownerId?: number;
  classId?: number;
  companyId?: number;
  fareSchemeId?: number;
  isActive?: boolean;
}

export interface VehicleUpdateRequest {
  // All fields optional for Partial Updates (PATCH/PUT logic)
  vehicleCode?: string;
  registrationNumber?: string;
  chassisNumber?: string;
  registrationDate?: string;
  revenueLicenseNumber?: string;
  revenueLicenseExpiryDate?: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
  comments?: string;
  manufactureYear?: number;
  makeId?: number;
  modelId?: number;
  fuelType?: FuelType | string;
  insurerId?: number;
  insuranceNumber?: string;
  insuranceExpiryDate?: string;
  ownerId?: number;
  classId?: number;
  companyId?: number;
  fareSchemeId?: number;
  isActive?: boolean;
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