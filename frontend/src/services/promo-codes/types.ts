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
// Promo Code Response
// ========================
export interface PromoCodeResponse {
  id: number;
  code: string;
  name: string | null;
  description: string | null;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number | null;
  minimumFare: number | null;
  startDate: string | null;
  endDate: string | null;
  maxUsage: number | null;
  currentUsage: number | null;
  maxUsagePerCustomer: number | null;
  isFirstTimeOnly: boolean;
  minimumHireCount: number | null;
  maxHireCount: number | null;
  applicableTo: string | null;
  corporateId: number | null;
  isActive: boolean;
  createdBy: number | null;
  vehicleClassIds: number[];
  totalDiscountGiven: number | null;
  uniqueCustomers: number | null;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Create/Update Requests
// ========================
export interface PromoCodeCreateRequest {
  code: string;
  name?: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  minimumFare?: number;
  startDate?: string; // ISO DateTime string
  endDate?: string;   // ISO DateTime string
  maxUsage?: number;
  maxUsagePerCustomer?: number;
  isFirstTimeOnly?: boolean;
  minimumHireCount?: number;
  maxHireCount?: number;
  applicableTo?: string;
  corporateId?: number;
  isActive?: boolean;
  vehicleClassIds?: number[];
}

export interface PromoCodeUpdateRequest {
  code?: string;
  name?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  minimumFare?: number;
  startDate?: string;
  endDate?: string;
  maxUsage?: number;
  maxUsagePerCustomer?: number;
  isFirstTimeOnly?: boolean;
  minimumHireCount?: number;
  maxHireCount?: number;
  applicableTo?: string;
  corporateId?: number;
  isActive?: boolean;
  vehicleClassIds?: number[];
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