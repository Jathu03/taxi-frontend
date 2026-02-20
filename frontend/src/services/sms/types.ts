// src/admin/services/sms/types.ts

// Match your backend SmsStatus enum values
export type SmsStatus = "PENDING" | "SENT" | "FAILED";

// Matches backend SmsLogDto
export interface SmsLogDto {
  id: number;
  smsType: string;
  phoneNumbers: string;
  recipientCount: number;
  message: string;
  status: SmsStatus;
  sentCount: number;
  failedCount: number;
  sentAt: string | null; // LocalDateTime -> ISO string
  providerName: string;
  errorMessage: string | null;
  createdAt: string; // LocalDateTime -> ISO string
}

// EXACTLY matches your Java SmsRequestDto
export interface SmsRequestDto {
  phoneNumbers: string[]; // List<String>
  message: string;
  smsType: string; // e.g. "MARKETING", "SYSTEM", "BULK", etc.
  driverId?: number;
  corporateId?: number;
  vehicleClassId?: number;
  sentByUserId?: number;
}

// Form-level types (what the UI uses)
export interface BulkSmsFormValues {
  phoneNumbers: string; // comma/newline separated in textarea
  message: string;
}

export interface VehicleClassSmsFormValues {
  vehicleClass: string; // e.g. "LUXURY" (you can later map to vehicleClassId)
  message: string;
}

export interface DriverSmsFormValues {
  driver: string; // driver phone or code; for now treated as phone
  message: string;
}