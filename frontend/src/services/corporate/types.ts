// === CORPORATE TYPES ===

export interface CreateCorporateRequest {
  name: string;
  code: string;
  primaryContact?: string;
  phone: string;
  email: string;
  address?: string;
  registrationDate?: string;
  billingType?: "DAILY" | "MONTHLY" | "PREPAID";
  creditLimit?: number;
  cashDiscountRate?: number;
  creditDiscountRate?: number;
  enableQuickBooking?: boolean;
  requireVoucher?: boolean;
  requireCostCenter?: boolean;
}

export interface CorporateVehicleClassResponse {
  id: number | null;        // mapping row id (corporate_vehicle_classes.id) or null if not mapped yet
  vehicleClassId: number;   // FK to master vehicle class
  className: string;
  classCode: string;
  isEnabled: boolean;
  customRate?: number | null;
}

export interface CorporateResponse {
  id: number;
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  billingType: string;
  creditLimit: number;
  currentBalance: number;
  cashDiscountRate: number;
  creditDiscountRate: number;
  enableQuickBooking: boolean;
  requireVoucher: boolean;
  requireCostCenter: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vehicleClasses: CorporateVehicleClassResponse[];
  vehicleCategories: any[]; // backend currently sends [], safe to keep as any[]
}

// === USER ASSIGNMENT TYPES ===

export interface AssignCorporateUserRequest {
  userId: number;
  designation: string;
  department: string;
  canBook: boolean;
  canViewReports: boolean;
  isActive: boolean; 
}

export interface UpdateCorporateUserRequest {
  designation?: string;
  department?: string;
  canBook?: boolean;
  canViewReports?: boolean;
  isActive?: boolean;
}

export interface CorporateUserResponse {
  id: number;
  corporateId: number;
  corporateName: string;
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  canBook: boolean;
  canViewReports: boolean;
  isActive: boolean; 
  createdAt: string;
}

export interface UserSimpleResponse {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  roles?: any[];
}