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
  cashDiscountRate: number;
  creditDiscountRate: number;
  enableQuickBooking: boolean;
  requireVoucher: boolean;
  requireCostCenter: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string>;
}