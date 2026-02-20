// src/pages/admin/bookings/PassengerOnboardReport.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Layers,
  Car,
  Clock,
  MapPin,
  MapPinned,
  Navigation,
  Gauge,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION (same report format)
// ============================================
export type OnboardBooking = {
  id: string;
  refNumber: string;
  customer: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
  from: string;
  to: string;
  currentLocation: string;
  distance: string;
  eta: string;
  status: "Onboard";
};

// ============================================
// HELPERS (backend mapping)
// ============================================
const TUK_CLASS_ID = 8;

const toLocal = (dt?: string) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
};

const resolveVehicleType = (b: BookingResponse): string => {
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return "Tuk";
  return (
    b.vehicleClassName ||
    b.vehicleClassCode ||
    `Class ${b.vehicleClassId ?? "N/A"}`
  );
};

const resolveVehicleNumber = (b: BookingResponse): string =>
  b.vehicleRegistrationNumber || b.vehicleCode || "—";

const mapBookingToReportRow = (b: BookingResponse): OnboardBooking => {
  return {
    id: String(b.id),
    refNumber: b.bookingId || String(b.id),
    customer: b.customerName || "N/A",
    driver: b.driverName || b.driverCode || "N/A",
    vehicle: resolveVehicleNumber(b),
    vehicleType: resolveVehicleType(b),

    // you don't have explicit "from/to" in backend response; use pickup/drop/destination
    from: b.pickupAddress || "N/A",
    to: b.dropAddress || b.destination || "N/A",

    currentLocation: b.currentLocation || "—",

    // backend has totalDistance but may be null while onboard
    distance:
      b.totalDistance !== null && b.totalDistance !== undefined
        ? `${b.totalDistance} km`
        : "—",

    eta: b.eta || "—",
    status: "Onboard",
  };
};

// ============================================
// HELPER FUNCTIONS (styling)
// ============================================
const getVehicleBadgeClass = (type: string) => {
  const map: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    TUK: "bg-yellow-100 text-yellow-800",
    VAN: "bg-slate-100 text-slate-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
};

const getETABadgeClass = (eta: string) => {
  const m = eta?.match?.(/(\d+)/);
  const mins = m ? parseInt(m[1], 10) : NaN;

  if (!Number.isFinite(mins)) return "bg-gray-100 text-gray-800 border-gray-200";
  if (mins <= 10) return "bg-green-100 text-green-800 border-green-300";
  if (mins <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-orange-100 text-orange-800 border-orange-300";
};

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<OnboardBooking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("customer")}</span>
      </div>
    ),
  },
  {
    accessorKey: "driver",
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("driver")}</span>,
  },
  {
    accessorKey: "vehicleType",
    header: () => <span className="font-bold text-black">Vehicle Type</span>,
    cell: ({ row }) => {
      const type = row.original.vehicleType as string;
      return (
        <Badge className={getVehicleBadgeClass(type)}>
          {type === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle #</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold">{row.getValue("vehicle")}</span>
    ),
  },
  {
    accessorKey: "from",
    header: () => <span className="font-bold text-black">From</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5 text-green-600" />
        <span className="text-sm">{row.getValue("from")}</span>
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: () => <span className="font-bold text-black">To</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPinned className="h-3.5 w-3.5 text-red-600" />
        <span className="text-sm">{row.getValue("to")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: () => <span className="font-bold text-black">Current Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "distance",
    header: () => <span className="font-bold text-black">Distance</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("distance")}</span>
      </div>
    ),
  },
  {
    accessorKey: "eta",
    header: () => <span className="font-bold text-black">ETA</span>,
    cell: ({ row }) => {
      const eta = row.getValue("eta") as string;
      return (
        <Badge variant="outline" className={getETABadgeClass(eta)}>
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </Badge>
      );
    },
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Booking ID", dataKey: "refNumber" },
  { header: "Customer", dataKey: "customer" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "From", dataKey: "from" },
  { header: "To", dataKey: "to" },
  { header: "Location", dataKey: "currentLocation" },
  { header: "Distance", dataKey: "distance" },
  { header: "ETA", dataKey: "eta" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function OnboardStatistics({ data }: { data: OnboardBooking[] }) {
  const stats = useMemo(() => {
    const urgent = data.filter((d) => {
      const m = d.eta?.match?.(/(\d+)/);
      const mins = m ? parseInt(m[1], 10) : NaN;
      return Number.isFinite(mins) && mins <= 10;
    });

    const near = data.filter((d) => {
      const m = d.eta?.match?.(/(\d+)/);
      const mins = m ? parseInt(m[1], 10) : NaN;
      return Number.isFinite(mins) && mins > 10 && mins <= 20;
    });

    const normal = data.filter((d) => {
      const m = d.eta?.match?.(/(\d+)/);
      const mins = m ? parseInt(m[1], 10) : NaN;
      return !Number.isFinite(mins) || mins > 20;
    });

    return {
      total: data.length,
      tuk: data.filter((d) => d.vehicleType === "Tuk").length,
      nonTuk: data.filter((d) => d.vehicleType !== "Tuk").length,
      urgent: urgent.length,
      near: near.length,
      normal: normal.length,
    };
  }, [data]);

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-green-700">
              Arriving ≤ 10 mins
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Urgent arrivals</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-yellow-700">
              11-20 mins
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-muted-foreground">Near arrivals</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-orange-700">
              &gt; 20 mins
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.normal}</div>
            <p className="text-xs text-muted-foreground">Standard arrivals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
            <Layers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total onboard trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
            <Car className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tuk}</div>
            <p className="text-xs text-muted-foreground">Tuk-tuk trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Non-Tuk</CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nonTuk}</div>
            <p className="text-xs text-muted-foreground">Car/Van/Bus trips</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function PassengerOnboardReport() {
  const [allOnboardData, setAllOnboardData] = useState<OnboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // build vehicle type filter options dynamically
  const vehicleTypeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(allOnboardData.map((d) => d.vehicleType).filter(Boolean))
    ) as string[];
    return unique.sort();
  }, [allOnboardData]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const bookings = await bookingService.searchAll({
          status: BookingStatus.PASSENGER_ONBOARD,
        });

        const onboardOnly = (bookings || []).filter(
          (b) => b.status === BookingStatus.PASSENGER_ONBOARD
        );

        setAllOnboardData(onboardOnly.map(mapBookingToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load passenger onboard report");
        setAllOnboardData([]);
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
    <div className="space-y-6">
      <OnboardStatistics data={allOnboardData} />

      <ReportPageTemplate
        title="Passenger Onboard Audit Report"
        data={allOnboardData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="customer"
        fileName="PassengerOnboard.pdf"
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
        ]}
      />
    </div>
  );
}