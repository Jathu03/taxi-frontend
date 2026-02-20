// src/admin/services/sms/smsService.ts

import axiosClient from "@/api/axiosClient";
import type {
  SmsLogDto,
  SmsRequestDto,
  BulkSmsFormValues,
  VehicleClassSmsFormValues,
  DriverSmsFormValues,
} from "./types";

const BASE_URL = "/api/sms";

// Change this to your real default country code
const DEFAULT_COUNTRY_CODE = "94"; // example: Sri Lanka. Use "91" for India, etc.

function toE164(raw: string): string {
  const trimmed = raw.replace(/\s+/g, "");

  if (!trimmed) return trimmed;

  // Already E.164
  if (trimmed.startsWith("+")) return trimmed;

  // Starts with 0 → replace leading 0 with country code
  if (trimmed.startsWith("0")) {
    return `+${DEFAULT_COUNTRY_CODE}${trimmed.substring(1)}`;
  }

  // Fallback: assume it's missing '+'
  return `+${DEFAULT_COUNTRY_CODE}${trimmed}`;
}

/**
 * Helper: convert textarea input into array of normalized phone numbers
 */
function parsePhoneNumbers(raw: string): string[] {
  return raw
    .split(/[,\n;]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map(toE164);
}

export const smsService = {
  send: async (data: SmsRequestDto): Promise<SmsLogDto> => {
    const response = await axiosClient.post<SmsLogDto>(`${BASE_URL}/send`, data);
    return response.data;
  },

  sendBulk: async (form: BulkSmsFormValues): Promise<SmsLogDto> => {
    const phoneNumbers = parsePhoneNumbers(form.phoneNumbers);

    const payload: SmsRequestDto = {
      phoneNumbers,
      message: form.message,
      smsType: "BULK",
    };

    return smsService.send(payload);
  },

  sendVehicleClass: async (
    form: VehicleClassSmsFormValues,
    vehicleClassId?: number
  ): Promise<SmsLogDto> => {
    const payload: SmsRequestDto = {
      phoneNumbers: [], // backend requires non-null list
      message: form.message,
      smsType: "VEHICLE_CLASS",
      vehicleClassId,
    };

    return smsService.send(payload);
  },

  sendDriver: async (form: DriverSmsFormValues): Promise<SmsLogDto> => {
    const driverPhoneRaw = form.driver.trim();
    const payload: SmsRequestDto = {
      phoneNumbers: driverPhoneRaw ? [toE164(driverPhoneRaw)] : [],
      message: form.message,
      smsType: "DRIVER",
    };

    return smsService.send(payload);
  },

  getLogs: async (): Promise<SmsLogDto[]> => {
    const response = await axiosClient.get<SmsLogDto[]>(`${BASE_URL}/logs`);
    return response.data;
  },
};