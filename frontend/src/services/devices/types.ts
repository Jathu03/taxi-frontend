// ========================
// Device Response
// ========================
export interface DeviceResponse {
  id: number;
  deviceId: string;
  deviceType: string;
  deviceModel: string | null;
  serialNumber: string | null;
  simNumber: string | null;
  simProvider: string | null;
  vehicleId: number | null;
  driverId: number | null;
  status: string;
  installDate: string | null; // ISO Date "YYYY-MM-DD"
  lastActive: string | null;
  gpsProvider: string | null;
  gpsAccountId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create Request
// ========================
export interface DeviceCreateRequest {
  deviceId: string;
  deviceType: string;
  deviceModel?: string;
  serialNumber?: string;
  simNumber?: string;
  simProvider?: string;
  vehicleId?: number;
  driverId?: number;
  status?: string;
  installDate?: string; // YYYY-MM-DD
  lastActive?: string;
  gpsProvider?: string;
  gpsAccountId?: string;
  notes?: string;
}

// ========================
// Update Request
// ========================
export interface DeviceUpdateRequest {
  deviceType?: string;
  deviceModel?: string;
  serialNumber?: string;
  simNumber?: string;
  simProvider?: string;
  vehicleId?: number;
  driverId?: number;
  status?: string;
  installDate?: string;
  notes?: string;
}

// ========================
// Query Params
// ========================
export interface DeviceQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  status?: string;
  deviceType?: string;
  vehicleId?: number;
  driverId?: number;
}