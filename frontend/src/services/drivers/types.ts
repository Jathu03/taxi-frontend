import type { ApiResponse } from "@/services/vehicles/types"; // Re-using generic response

// ========================
// Driver Response
// ========================
export interface DriverResponse {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nic: string | null;
  // ISO Date "YYYY-MM-DD"
  birthDate: string | null;
  contactNumber: string;
  emergencyNumber: string | null;
  address: string | null;
  profileImageUrl: string | null;
  
  isBlocked: boolean;
  blockedDescription: string | null;
  manualDispatchOnly: boolean;
  isVerified: boolean;
  isActive: boolean;
  
  licenseNumber: string | null;
  licenseExpiryDate: string | null;
  licenseImageUrl: string | null;
  
  // Relations (IDs and display names)
  vehicleId: number | null;
  vehicleRegistrationNumber?: string; // Transient field from backend
  
  userId: number | null;
  username?: string; // Transient field from backend
  
  companyId: number | null;
  companyName?: string; // Transient field from backend
  
  appVersion: string | null;
  lastLocation: string | null;
  lastLocationTime: string | null;
  averageRating: number;
  ratingCount: number;
  
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create Request
// ========================
export interface DriverCreateRequest {
  code: string;
  firstName: string;
  lastName?: string;
  nic?: string;
  birthDate?: string; // Format: "YYYY-MM-DD"
  contactNumber: string;
  emergencyNumber?: string;
  address?: string;
  profileImageUrl?: string;
  
  manualDispatchOnly?: boolean;
  
  licenseNumber?: string;
  licenseExpiryDate?: string; // Format: "YYYY-MM-DD"
  licenseImageUrl?: string;
  
  vehicleId?: number;
  userId?: number;
  companyId?: number;
}

// ========================
// Update Request
// ========================
export interface DriverUpdateRequest {
  firstName?: string;
  lastName?: string;
  nic?: string;
  birthDate?: string;
  contactNumber?: string;
  emergencyNumber?: string;
  address?: string;
  profileImageUrl?: string;
  
  manualDispatchOnly?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  
  licenseNumber?: string;
  licenseExpiryDate?: string;
  licenseImageUrl?: string;
  
  vehicleId?: number;
  userId?: number;
  companyId?: number;
  
  appVersion?: string;
  deviceToken?: string;
}

// ========================
// Block/Unblock Request
// ========================
export interface DriverBlockRequest {
  isBlocked: boolean;
  blockedDescription?: string;
}

// ========================
// Query Params
// ========================
export interface DriverQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  companyId?: number;
}