// src/pages/admin/bookings/CancelledHiresReport.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cancelService } from "@/services/bookings/cancelService";
import type { BookingCancellationResponse } from "@/services/bookings/cancelService";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION (same as your report)
// ============================================
export type CancelledBooking = {
  id: string;
  bookingNumber: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  testBooking: string;
  cancelledTime: string;
  cancelledType: "Customer" | "Driver" | "System" | "No Show";
  cancelledAgent: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
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

function resolveVehicleType(b?: BookingResponse) {
  if (!b) return "N/A";
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return "Tuk";
  return b.vehicleClassName || b.vehicleClassCode || "N/A";
}

function resolveCancelledType(c: BookingCancellationResponse): CancelledBooking["cancelledType"] {
  const by = (c.cancelledByType || "").toUpperCase();
  const reason = (c.cancellationReason || "").toUpperCase();

  if (reason.includes("NO SHOW") || reason.includes("NOSHOW")) return "No Show";
  if (by.includes("DRIVER")) return "Driver";
  if (by.includes("USER") || by.includes("CUSTOMER")) return "Customer";
  return "System"; // ADMIN/SYSTEM/unknown
}

function mapToReportRow(
  c: BookingCancellationResponse,
  booking?: BookingResponse
): CancelledBooking {
  return {
    id: String(c.id),
    bookingNumber: c.bookingNumber || String(c.bookingId),

    org: booking?.corporateName || booking?.bookingSource || "N/A",
    customer: booking?.customerName || c.cancelledByUserName || "N/A",
    passenger: booking?.contactNumber || "N/A",
    hireType: booking?.hireType || "N/A",
    bookingTime: toLocal(booking?.bookingTime),
    testBooking: booking?.isTestBooking ? "Yes" : "No",

    cancelledTime: toLocal(c.cancelledTime),
    cancelledType: resolveCancelledType(c),

    // best available "agent" string from cancellation
    cancelledAgent:
      c.cancelledByUserName ||
      c.cancelledByDriverName ||
      c.cancelledByType ||
      "N/A",

    driver: booking?.driverName || booking?.driverCode || "N/A",
    vehicle:
      booking?.vehicleRegistrationNumber || booking?.vehicleCode || "N/A",
    vehicleType: resolveVehicleType(booking),
  };
}

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<CancelledBooking>[] = [
  { accessorKey: "bookingNumber", header: "Booking #" },
  { accessorKey: "org", header: "Org" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "cancelledTime", header: "Cancelled At" },
  {
    accessorKey: "cancelledType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("cancelledType")}</Badge>
    ),
  },
  { accessorKey: "driver", header: "Driver" },
  { accessorKey: "vehicle", header: "Vehicle" },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Booking Number", dataKey: "bookingNumber" },
  { header: "Organization", dataKey: "org" },
  { header: "Customer Name", dataKey: "customer" },
  { header: "Passenger Contact", dataKey: "passenger" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Booking Time", dataKey: "bookingTime" },
  { header: "Cancelled Time", dataKey: "cancelledTime" },
  { header: "Cancellation Type", dataKey: "cancelledType" },
  { header: "Cancelled By", dataKey: "cancelledAgent" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
];

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function CancelledHiresReport() {
  const [allCancelledData, setAllCancelledData] = useState<CancelledBooking[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // cache bookings by bookingId (booking DB id)
  const bookingCacheRef = useRef<Record<number, BookingResponse>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) get cancellations
        const cancellations = await cancelService.getAllCancelledHires({});

        // 2) enrich with booking details for vehicleType/org/hireType/etc
        const uniqueBookingIds = Array.from(
          new Set((cancellations || []).map((c) => Number(c.bookingId)).filter(Boolean))
        );

        const idsToFetch = uniqueBookingIds.filter(
          (id) => !bookingCacheRef.current[id]
        );

        await Promise.allSettled(
          idsToFetch.map(async (id) => {
            const b = await bookingService.getBookingById(id);
            bookingCacheRef.current[id] = b;
          })
        );

        // 3) map to report rows
        const reportRows = (cancellations || []).map((c) => {
          const bookingId = Number(c.bookingId);
          const booking = bookingCacheRef.current[bookingId];
          return mapToReportRow(c, booking);
        });

        setAllCancelledData(reportRows);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load cancelled hires report");
        setAllCancelledData([]);
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
      title="Cancelled Hires Audit Report"
      data={allCancelledData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
      searchKey="customer"
      fileName="CancelledHires.csv"
      filters={[
        {
          key: "vehicleType",
          label: "Vehicle Type",
          options: [
            { label: "All Vehicles", value: "all" },
            { label: "Tuk Only", value: "Tuk" },
            { label: "Cars/Buses", value: "ECONOMY" },
          ],
          defaultValue: "all",
        },
        {
          key: "cancelledType",
          label: "Cancellation Type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Customer", value: "Customer" },
            { label: "Driver", value: "Driver" },
            { label: "System", value: "System" },
            { label: "No Show", value: "No Show" },
          ],
          defaultValue: "all",
        },
        {
          key: "hireType",
          label: "Hire Type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Corporate", value: "Corporate" },
            { label: "Budget", value: "Budget" },
            { label: "Tuk-Hire", value: "Tuk-Hire" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}