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
// Company Response
// ========================
export interface CompanyResponse {
  id: number;
  companyName: string;
  companyCode: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Company Create Request
// ========================
export interface CompanyCreateRequest {
  companyName: string;
  companyCode?: string;
  isActive?: boolean;
}

// ========================
// Company Update Request
// ========================
export interface CompanyUpdateRequest {
  companyName?: string;
  companyCode?: string;
  isActive?: boolean;
}

// ========================
// Company Query Params
// ========================
export interface CompanyQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

// ========================
// Vehicle Owner Response
// ========================
export interface VehicleOwnerResponse {
  id: number;
  name: string;
  nicOrBusinessReg: string | null;
  company: string | null;
  email: string | null;
  primaryContact: string;
  secondaryContact: string | null;
  postalAddress: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Vehicle Owner Create Request
// ========================
export interface VehicleOwnerCreateRequest {
  name: string;
  nicOrBusinessReg?: string;
  company?: string;
  email?: string;
  primaryContact: string;
  secondaryContact?: string;
  postalAddress?: string;
  isActive?: boolean;
}

// ========================
// Vehicle Owner Update Request
// ========================
export interface VehicleOwnerUpdateRequest {
  name?: string;
  nicOrBusinessReg?: string;
  company?: string;
  email?: string;
  primaryContact?: string;
  secondaryContact?: string;
  postalAddress?: string;
  isActive?: boolean;
}

// ========================
// Vehicle Owner Query Params
// ========================
export interface VehicleOwnerQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}