// ========================
// Driver Activity Log Response
// ========================
export interface DriverActivityLogResponse {
  id: number;
  driverId: number;
  driverCode: string | null;
  driverName: string | null;
  activityType: string;
  vehicleId: number | null;
  vehicleCode: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  onlineTime: string | null;
  offlineTime: string | null;
  totalOnlineDuration: number | null; // In minutes
  logDate: string; // YYYY-MM-DD
  createdAt: string;
}

// ========================
// Create Request
// ========================
export interface DriverActivityLogCreateRequest {
  driverId: number;
  activityType: string;
  vehicleId?: number;
  vehicleCode?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  onlineTime?: string;
  offlineTime?: string;
  totalOnlineDuration?: number;
  logDate: string; // YYYY-MM-DD
}

// ========================
// Query Params
// ========================
export interface DriverActivityLogQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  driverId?: number;
  activityType?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  logDate?: string;   // YYYY-MM-DD
  vehicleId?: number;
}

// ========================
// Paged Response (Matches Spring Boot PagedResponse)
// ========================
export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}