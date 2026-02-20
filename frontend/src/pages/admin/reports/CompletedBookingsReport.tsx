// src/pages/admin/bookings/CompletedBookingsReport.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION
// ============================================
export type CompletedBooking = {
  id: string;
  booking: string;
  voucher: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dispatchedTime: string;
  dispatchedBy: string;
  startTime: string;
  completedTime: string;
  totalDistance: string;
  totalFare: string;
  waitingTime: string;
  billedWaitTime: string;
  waitingFee: string;
  testBooking: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
  fareScheme: string;
  status: "Completed";
};

// ============================================
// HELPERS
// ============================================
const TUK_CLASS_ID = 8;

function toLocal(dt?: string) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function formatNum(value?: number, fractionDigits = 2) {
  if (value === null || value === undefined) return "0.00";
  try {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return String(value);
  }
}

function formatDistanceKm(value?: number) {
  if (value === null || value === undefined) return "N/A";
  return `${formatNum(value, 1)} km`;
}

function formatMinutes(value?: number) {
  if (value === null || value === undefined) return "N/A";
  return `${Math.round(value)} mins`;
}

function resolveVehicleType(b: BookingResponse): string {
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return "Tuk";
  return (
    b.vehicleClassName ||
    b.vehicleClassCode ||
    `Class ${b.vehicleClassId ?? "N/A"}`
  );
}

function mapBookingToCompletedReportRow(b: BookingResponse): CompletedBooking {
  return {
    id: String(b.id),
    booking: b.bookingId || String(b.id),
    voucher: b.voucherNumber || "N/A",
    org: b.corporateName || b.bookingSource || "N/A",
    customer: b.customerName || "N/A",
    passenger: b.passengerName || b.customerName || "N/A",
    hireType: b.hireType || "N/A",
    bookingTime: toLocal(b.bookingTime),
    bookedBy: b.bookedByName || "System",
    pickupTime: toLocal(b.pickupTime),
    pickupAddress: b.pickupAddress || "N/A",
    dispatchedTime: toLocal(b.dispatchedTime),
    dispatchedBy: b.dispatchedByName || "System",
    startTime: toLocal(b.startTime),
    completedTime: toLocal(b.completedTime),
    totalDistance: formatDistanceKm(b.totalDistance),
    totalFare: formatNum(b.totalFare, 2),
    waitingTime: formatMinutes(b.totalWaitTime),
    billedWaitTime: formatMinutes(b.billedWaitTime),
    waitingFee: formatNum(b.totalWaitingFee, 2),
    testBooking: b.isTestBooking ? "Yes" : "No",
    driver: b.driverName || b.driverCode || "N/A",
    vehicle: b.vehicleRegistrationNumber || b.vehicleCode || "N/A",
    vehicleType: resolveVehicleType(b),
    fareScheme: b.fareSchemeName || b.fareSchemeCode || "N/A",
    status: "Completed",
  };
}

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<CompletedBooking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "booking",
    header: () => <span className="font-bold text-black">Booking</span>,
  },
  {
    accessorKey: "org",
    header: () => <span className="font-bold text-black">Org</span>,
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
  },
  {
    accessorKey: "pickupAddress",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "totalDistance",
    header: () => <span className="font-bold text-black">Distance</span>,
  },
  {
    accessorKey: "totalFare",
    header: () => <span className="font-bold text-black">Fare</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">Rs. {row.getValue("totalFare")}</span>
    ),
  },
  {
    accessorKey: "driver",
    header: () => <span className="font-bold text-black">Driver</span>,
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold">{row.getValue("vehicle")}</span>
    ),
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Booking", dataKey: "booking" },
  { header: "Voucher", dataKey: "voucher" },
  { header: "Organization", dataKey: "org" },
  { header: "Customer", dataKey: "customer" },
  { header: "Passenger", dataKey: "passenger" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Pickup Address", dataKey: "pickupAddress" },
  { header: "Booking Time", dataKey: "bookingTime" },
  { header: "Pickup Time", dataKey: "pickupTime" },
  { header: "Start Time", dataKey: "startTime" },
  { header: "Completed Time", dataKey: "completedTime" },
  { header: "Total Distance", dataKey: "totalDistance" },
  { header: "Total Fare", dataKey: "totalFare" },
  { header: "Waiting Time", dataKey: "waitingTime" },
  { header: "Billed Wait Time", dataKey: "billedWaitTime" },
  { header: "Waiting Fee", dataKey: "waitingFee" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Fare Scheme", dataKey: "fareScheme" },
  { header: "Test Booking", dataKey: "testBooking" },
];

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function CompletedBookingsReport() {
  const [allCompletedData, setAllCompletedData] = useState<CompletedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic options to prevent filter mismatch errors
  const vehicleTypeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(allCompletedData.map((d) => d.vehicleType).filter(Boolean))
    ) as string[];
    return unique.sort();
  }, [allCompletedData]);

  const hireTypeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(allCompletedData.map((d) => d.hireType).filter(Boolean))
    ) as string[];
    return unique.sort();
  }, [allCompletedData]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const bookings = await bookingService.searchAll({
          status: BookingStatus.COMPLETED,
        });

        const completedOnly = (bookings || []).filter(
          (b) => b.status === BookingStatus.COMPLETED
        );

        setAllCompletedData(completedOnly.map(mapBookingToCompletedReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load completed bookings report");
        setAllCompletedData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ReportPageTemplate
      title="Completed Bookings Audit Report"
      data={allCompletedData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
      searchKey="customer"
      fileName="CompletedBookings.pdf"
      filters={[
        {
          key: "vehicleType",
          label: "Vehicle Type",
          options: [
            { label: "All Vehicles", value: "all" },
            ...vehicleTypeOptions.map((v) => ({ label: v, value: v })),
          ],
          defaultValue: "all",
        },
        {
          key: "hireType",
          label: "Hire Type",
          options: [
            { label: "All Types", value: "all" },
            ...hireTypeOptions.map((h) => ({ label: h, value: h })),
          ],
          defaultValue: "all",
        },
        {
          key: "testBooking",
          label: "Test Booking",
          options: [
            { label: "All", value: "all" },
            { label: "Test Only", value: "Yes" },
            { label: "Real Only", value: "No" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}