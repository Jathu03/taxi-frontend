// src/pages/UnifiedWaitingReports.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  AlertTriangle,
  Timer,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION
// ============================================
type WaitingBooking = {
  id: string;
  refNumber: string;
  customer: string;
  phone: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
  vehicleCategory: "Tuk" | "nonTuk";
  location: string;
  arrivalTime: string;
  waiting: string;
  waitingMinutes: number;
  urgencyLevel: "normal" | "near" | "urgent";
  urgencyDisplay: string;
  status: "Waiting";
  searchField?: string;
};

// ============================================
// HELPERS (same behavior as your mock version)
// ============================================
const TUK_CLASS_ID = 8;

const getUrgencyLevel = (minutes: number): "normal" | "near" | "urgent" => {
  if (minutes <= 10) return "normal";
  if (minutes <= 20) return "near";
  return "urgent";
};

const getUrgencyDisplay = (level: "normal" | "near" | "urgent"): string => {
  switch (level) {
    case "normal":
      return "Normal (≤10 min)";
    case "near":
      return "Near Urgent (11-20 min)";
    case "urgent":
      return "Urgent (>20 min)";
  }
};

const toLocal = (dt?: string) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
};

const waitingMinutesFromArrivedTime = (driverArrivedTime?: string): number => {
  if (!driverArrivedTime) return 0;
  const arrived = new Date(driverArrivedTime);
  if (isNaN(arrived.getTime())) return 0;
  const diffMs = Date.now() - arrived.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

const isTukBooking = (b: BookingResponse) =>
  Number(b.vehicleClassId) === TUK_CLASS_ID ||
  (b.vehicleClassName || "").toUpperCase().includes("TUK");

const resolveVehicleType = (b: BookingResponse) => {
  if (isTukBooking(b)) return "Tuk";
  return (
    b.vehicleClassName ||
    b.vehicleClassCode ||
    `Class ${b.vehicleClassId ?? "N/A"}`
  );
};

const resolveVehicleNumber = (b: BookingResponse) =>
  b.vehicleRegistrationNumber || b.vehicleCode || "—";

const resolveLocation = (b: BookingResponse) =>
  b.currentLocation || b.pickupAddress || "N/A";

const mapBookingToWaiting = (b: BookingResponse): WaitingBooking => {
  const vehicleType = resolveVehicleType(b);
  const vehicleCategory: "Tuk" | "nonTuk" = vehicleType === "Tuk" ? "Tuk" : "nonTuk";

  const waitingMinutes = waitingMinutesFromArrivedTime(b.driverArrivedTime);
  const urgencyLevel = getUrgencyLevel(waitingMinutes);

  const refNumber = b.bookingId || String(b.id);

  return {
    id: String(b.id),
    refNumber,
    customer: b.customerName || "N/A",
    phone: b.contactNumber || "N/A",
    driver: b.driverName || b.driverCode || "N/A",
    vehicle: resolveVehicleNumber(b),
    vehicleType,
    vehicleCategory,
    location: resolveLocation(b),
    arrivalTime: toLocal(b.driverArrivedTime),
    waiting: `${waitingMinutes} mins`,
    waitingMinutes,
    urgencyLevel,
    urgencyDisplay: getUrgencyDisplay(urgencyLevel),
    status: "Waiting",
    searchField: `${refNumber} ${b.customerName || ""} ${b.contactNumber || ""} ${b.driverName || ""} ${resolveVehicleNumber(b)} ${resolveLocation(b)}`,
  };
};

// ============================================
// STYLING HELPERS
// ============================================
const getVehicleBadgeClass = (vehicleType: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800 border-orange-300",
    Luxury: "bg-purple-100 text-purple-800 border-purple-300",
    ECONOMY: "bg-green-100 text-green-800 border-green-300",
    STANDARD: "bg-blue-100 text-blue-800 border-blue-300",
    Tuk: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };
  return colorMap[vehicleType] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getUrgencyBadgeClass = (urgency: string) => {
  const colorMap: Record<string, string> = {
    normal: "bg-green-100 text-green-800 border-green-300",
    near: "bg-yellow-100 text-yellow-800 border-yellow-300",
    urgent: "bg-red-100 text-red-800 border-red-300",
  };
  return colorMap[urgency] || "bg-gray-100 text-gray-800 border-gray-200";
};

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<WaitingBooking>[] = [
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
      <span className="font-mono font-medium text-red-700">
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
    accessorKey: "phone",
    header: () => <span className="font-bold text-black">Phone</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="h-3.5 w-3.5 text-green-600" />
        <span className="font-mono text-sm">{row.getValue("phone")}</span>
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
      const vehicleType = row.getValue("vehicleType") as string;
      return (
        <Badge variant="outline" className={getVehicleBadgeClass(vehicleType)}>
          {vehicleType === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicleType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle #</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("vehicle")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: () => <span className="font-bold text-black">Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-blue-500" />
        <span className="text-sm">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: () => <span className="font-bold text-black">Arrival Time</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono">{row.getValue("arrivalTime")}</span>
      </div>
    ),
  },
  {
    accessorKey: "waiting",
    header: () => <span className="font-bold text-black">Waiting</span>,
    cell: ({ row }) => {
      const urgency = row.original.urgencyLevel;
      return (
        <Badge variant="outline" className={getUrgencyBadgeClass(urgency)}>
          <Timer className="h-3 w-3 mr-1" />
          {row.getValue("waiting")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "urgencyLevel",
    header: () => <span className="font-bold text-black">Urgency</span>,
    cell: ({ row }) => {
      const urgency = row.getValue("urgencyLevel") as "normal" | "near" | "urgent";

      const icons: Record<WaitingBooking["urgencyLevel"], React.ReactNode> = {
        normal: <CheckCircle className="h-3 w-3 mr-1" />,
        near: <Clock className="h-3 w-3 mr-1" />,
        urgent: <AlertTriangle className="h-3 w-3 mr-1" />,
      };

      const labels: Record<WaitingBooking["urgencyLevel"], string> = {
        normal: "Normal",
        near: "Near Urgent",
        urgent: "Urgent",
      };

      return (
        <Badge variant="outline" className={getUrgencyBadgeClass(urgency)}>
          {icons[urgency]}
          {labels[urgency]}
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
  { header: "Phone", dataKey: "phone" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Location", dataKey: "location" },
  { header: "Arrival", dataKey: "arrivalTime" },
  { header: "Waiting", dataKey: "waiting" },
  { header: "Urgency", dataKey: "urgencyDisplay" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function WaitingStatistics({
  data,
  locationCount,
}: {
  data: WaitingBooking[];
  locationCount: number;
}) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      tuk: data.filter((d) => d.vehicleCategory === "Tuk").length,
      nonTuk: data.filter((d) => d.vehicleCategory === "nonTuk").length,
      normal: data.filter((d) => d.urgencyLevel === "normal").length,
      near: data.filter((d) => d.urgencyLevel === "near").length,
      urgent: data.filter((d) => d.urgencyLevel === "urgent").length,
      locationCount,
    };
  }, [data, locationCount]);

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Normal (≤ 10 mins)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.normal}</div>
            <p className="text-xs text-green-600">Within acceptable time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Near Urgent (11-20 mins)
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-yellow-600">Approaching threshold</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Urgent (&gt; 20 mins)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.urgent}</div>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
            <Timer className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All bookings waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tuk Vehicles</CardTitle>
            <Car className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.tuk}</div>
            <p className="text-xs text-muted-foreground">Three-wheelers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
            <Car className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.nonTuk}</div>
            <p className="text-xs text-muted-foreground">Regular vehicles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-indigo-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{stats.locationCount}</div>
            <p className="text-xs text-muted-foreground">Active pickup points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function UnifiedWaitingReports() {
  const [allWaitingData, setAllWaitingData] = useState<WaitingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const bookings = await bookingService.searchAll({
          status: BookingStatus.WAITING_FOR_CUSTOMER,
        });

        const waitingOnly = (bookings || []).filter(
          (b) => b.status === BookingStatus.WAITING_FOR_CUSTOMER
        );

        setAllWaitingData(waitingOnly.map(mapBookingToWaiting));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load waiting bookings report");
        setAllWaitingData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const uniqueLocations = useMemo(
    () =>
      Array.from(
        new Set(allWaitingData.map((d) => d.location).filter(Boolean))
      ).sort(),
    [allWaitingData]
  );

  const uniqueVehicleTypes = useMemo(
    () =>
      Array.from(
        new Set(allWaitingData.map((d) => d.vehicleType).filter(Boolean))
      ).sort(),
    [allWaitingData]
  );

  const locationOptions = useMemo(
    () => [
      { label: "All Locations", value: "all" },
      ...uniqueLocations.map((loc) => ({ label: loc, value: loc })),
    ],
    [uniqueLocations]
  );

  const vehicleTypeOptions = useMemo(
    () => [
      { label: "All Vehicle Types", value: "all" },
      ...uniqueVehicleTypes.map((type) => ({ label: type, value: type })),
    ],
    [uniqueVehicleTypes]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WaitingStatistics
        data={allWaitingData}
        locationCount={uniqueLocations.length}
      />

      <ReportPageTemplate
        title="Driver Waiting Bookings Report"
        data={allWaitingData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="WaitingBookingsReport.pdf"
        filters={[
          {
            key: "vehicleCategory",
            label: "Vehicle Category",
            options: [
              { label: "All Vehicles", value: "all" },
              { label: "Tuk Only", value: "Tuk" },
              { label: "Cars & Buses (Non-Tuk)", value: "nonTuk" },
            ],
            defaultValue: "all",
          },
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: vehicleTypeOptions,
            defaultValue: "all",
          },
          {
            key: "location",
            label: "Location",
            options: locationOptions,
            defaultValue: "all",
          },
          {
            key: "urgencyLevel",
            label: "Waiting Urgency",
            options: [
              { label: "All Levels", value: "all" },
              { label: "Normal (≤ 10 mins)", value: "normal" },
              { label: "Near Urgent (11-20 mins)", value: "near" },
              { label: "Urgent (> 20 mins)", value: "urgent" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}