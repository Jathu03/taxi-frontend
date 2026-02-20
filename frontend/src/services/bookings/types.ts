// 1. Replace BookingStatus Enum with const object + type
export const BookingStatus = {
  PENDING: "PENDING",
  INQUIRY: "INQUIRY",
  DISPATCHED: "DISPATCHED",
  ENROUTE: "ENROUTE",
  WAITING_FOR_CUSTOMER: "WAITING_FOR_CUSTOMER",
  PASSENGER_ONBOARD: "PASSENGER_ONBOARD",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

// This creates a type that equals "PENDING" | "INQUIRY" | ...
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// 2. Replace PaymentType Enum
export const PaymentType = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  CORPORATE_BILLING: "CORPORATE_BILLING",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export interface CreateBookingRequest {
  customerName: string;
  customerEmail?: string;
  contactNumber: string;
  passengerName?: string;
  numberOfPassengers?: number;
  corporateId?: number;
  voucherNumber?: string;
  costCenter?: string;
  hireType?: string;
  vehicleClassId: number;
  fareSchemeId?: number;
  paymentType?: PaymentType;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropAddress?: string;
  dropLatitude?: number;
  dropLongitude?: number;
  destination?: string;
  estimatedDistance?: number;
  pickupTime?: string; // ISO Date String
  scheduledTime?: string; // ISO Date String
  isAdvanceBooking?: boolean;
  isTestBooking?: boolean;
  isInquiryOnly?: boolean;
  luggage?: number;
  specialRemarks?: string;
  clientRemarks?: string;
  remarks?: string;
  percentage?: number;
  sendClientSms?: boolean;
  bookedBy?: number;
  appPlatform?: string;
  bookingSource?: string;
  promoCodeId?: number;
}

export interface BookingResponse {
  id: number;
  bookingId: string;
  voucherNumber?: string;
  costCenter?: string;

  // Customer Information
  customerName: string;
  customerEmail?: string;
  contactNumber: string;
  passengerName?: string;
  numberOfPassengers?: number;

  // Corporate Information
  corporateId?: number;
  corporateName?: string;
  corporateCode?: string;

  // Hire Details
  hireType?: string;

  // Vehicle Class Information
  vehicleClassId: number;
  vehicleClassName?: string;
  vehicleClassCode?: string;

  // Fare Scheme Information
  fareSchemeId?: number;
  fareSchemeName?: string;
  fareSchemeCode?: string;

  paymentType?: PaymentType;

  // Location Information
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropAddress?: string;
  dropLatitude?: number;
  dropLongitude?: number;
  destination?: string;
  estimatedDistance?: number;

  // Timing (Dates come as strings from JSON)
  bookingTime: string; 
  pickupTime?: string;
  scheduledTime?: string;

  // Flags
  isAdvanceBooking?: boolean;
  isTestBooking?: boolean;
  isInquiryOnly?: boolean;

  // Assignment
  driverId?: number;
  driverCode?: string;
  driverName?: string;
  driverPhone?: string;

  vehicleId?: number;
  vehicleCode?: string;
  vehicleRegistrationNumber?: string;

  // Dispatch Information
  dispatchedTime?: string;
  dispatchedBy?: number;
  dispatchedByName?: string;

  // Trip Progress
  driverAcceptedTime?: string;
  driverArrivedTime?: string;
  startTime?: string;
  completedTime?: string;

  // Location Tracking
  currentLocation?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  eta?: string;

  // Completion Details
  startOdometer?: number;
  endOdometer?: number;
  totalDistance?: number;
  totalWaitTime?: number;
  billedWaitTime?: number;
  totalWaitingFee?: number;

  // Fare Breakdown
  baseFare?: number;
  distanceFare?: number;
  timeFare?: number;
  surgeFee?: number;
  discountAmount?: number;

  // Promo Code Information
  promoCodeId?: number;
  promoCode?: string;

  totalFare?: number;

  // Additional Information
  luggage?: number;
  specialRemarks?: string;
  clientRemarks?: string;
  remarks?: string;
  percentage?: number;
  sendClientSms?: boolean;

  // Status
  status: BookingStatus;

  // Agent Information
  bookedBy?: number;
  bookedByName?: string;
  appPlatform?: string;
  bookingSource?: string;

  // Ratings
  customerRating?: number;
  customerFeedback?: string;
  driverRating?: number;
  driverFeedback?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface BookingSearchRequest {
  status?: BookingStatus | "all";
  vehicleClassId?: number;
  corporateId?: number;
  driverId?: number;
  bookedBy?: number;
  hireType?: string;
  paymentType?: PaymentType;
  bookingSource?: string;
  startDate?: string;
  endDate?: string;
  excludeTestBookings?: boolean;
}

export interface VehicleClass {
  id: number;
  className: string;
  classCode: string;
  description?: string;
  imageUrl?: string;
}

// Generic Wrapper to match your Java ApiResponse
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}