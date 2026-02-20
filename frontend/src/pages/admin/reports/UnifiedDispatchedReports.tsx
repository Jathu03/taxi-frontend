"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Smartphone, Globe, Car, User, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION (same report format)
// ============================================
export type DispatchedBooking = {
  id: string;
  refNumber: string;
  organization?: string;
  customer: string;
  contact: string;
  hireType?: string;
  pickupTime: string;
  pickup: string;
  bookedBy?: string;
  dispatchedBy: string;
  dispatchedTime: string;
  driver: string;
  vehicle: string;
  vehicleType?: string;
  fareScheme?: string;
  source: "Portal" | "App";
  platform?: "Android" | "iOS";
  status: "Dispatched";
};

// ============================================
// HELPERS
// ============================================

const TUK_CLASS_ID = 8;

function toLocal(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function inferSource(b: BookingResponse): "Portal" | "App" {
  const src = (b.bookingSource || "").toUpperCase().trim();
  const platform = (b.appPlatform || "").toUpperCase().trim();

  if (src === "MOBILE_APP") return "App";
  if (platform && platform !== "WEB") return "App";
  return "Portal";
}

function inferPlatform(b: BookingResponse): "Android" | "iOS" | undefined {
  const p = (b.appPlatform || "").toUpperCase();
  if (!p) return undefined;
  if (p.includes("IOS")) return "iOS";
  if (p.includes("ANDROID")) return "Android";
  return undefined;
}

function normalizeVehicleType(b: BookingResponse): string {
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return "Tuk";
  return b.vehicleClassName || b.vehicleClassCode || `Class ${b.vehicleClassId ?? "N/A"}`;
}

function mapBookingToDispatched(b: BookingResponse): DispatchedBooking {
  const source = inferSource(b);
  const platform = source === "App" ? inferPlatform(b) : undefined;

  return {
    id: String(b.id),
    refNumber: b.bookingId || String(b.id),
    organization: b.corporateName || b.bookingSource || "",
    customer: b.customerName || "N/A",
    contact: b.contactNumber || "N/A",
    hireType: b.hireType || "",
    pickupTime: toLocal(b.pickupTime),
    pickup: b.pickupAddress || "N/A",
    bookedBy: b.bookedByName || "System",
    dispatchedBy: b.dispatchedByName || "System",
    dispatchedTime: toLocal(b.dispatchedTime),
    driver: b.driverName || b.driverCode || "N/A",
    vehicle: b.vehicleRegistrationNumber || b.vehicleCode || "—",
    vehicleType: normalizeVehicleType(b),
    fareScheme: b.fareSchemeName || b.fareSchemeCode || "",
    source,
    platform,
    status: "Dispatched",
  };
}

const getVehicleBadgeClass = (vehicleType: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    TUK: "bg-yellow-100 text-yellow-800",
  };
  return colorMap[vehicleType] || "bg-gray-100 text-gray-800";
};

// ============================================
// TABLE COLUMNS
// ============================================
const selectColumn: ColumnDef<DispatchedBooking> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
};

const tableColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Ref ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">{row.getValue("refNumber")}</span>
    ),
  },
  {
    accessorKey: "source",
    header: () => <span className="font-bold text-black">Source</span>,
    cell: ({ row }) => {
      const source = row.original.source;
      const platform = row.original.platform;
      const vehicleType = row.original.vehicleType;
      const isTuk = vehicleType === "Tuk";

      if (source === "App") {
        return (
          <Badge
            variant="outline"
            className={`gap-1 ${
              isTuk
                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                : platform === "iOS"
                  ? "border-gray-500 text-gray-700 bg-gray-50"
                  : "border-green-600 text-green-700 bg-green-50"
            }`}
          >
            {isTuk ? <Car className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
            {isTuk ? `Tuk App (${platform ?? "Unknown"})` : `App (${platform ?? "Unknown"})`}
          </Badge>
        );
      }

      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            isTuk ? "border-yellow-500 text-yellow-700 bg-yellow-50" : "border-blue-500 text-blue-700 bg-blue-50"
          }`}
        >
          {isTuk ? <Car className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {isTuk ? "Tuk (Manual)" : "Manual/Portal"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => <div className="font-medium">{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <span className="font-bold text-black">Contact</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">{row.getValue("contact")}</span>
    ),
  },
  {
    accessorKey: "pickupTime",
    header: () => <span className="font-bold text-black">Pickup Time</span>,
    cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("pickupTime")}</span>,
  },
  {
    accessorKey: "dispatchedBy",
    header: () => <span className="font-bold text-black">Dispatched By</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">{row.getValue("dispatchedBy")}</span>
      </div>
    ),
  },
  {
    accessorKey: "dispatchedTime",
    header: () => <span className="font-bold text-black">Dispatched Time</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue("dispatchedTime")}</span>
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
      const vehicleType = (row.original.vehicleType || "") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicleType)}>
          {vehicleType === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicleType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle/Tuk #</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold">{row.getValue("vehicle")}</span>
    ),
  },
];

// ============================================
// EXPORT COLUMNS (same format)
// ============================================
const exportColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  {
    header: "Source",
    dataKey: "source",
    formatter: (value: string, row: DispatchedBooking) => {
      const isTuk = row.vehicleType === "Tuk";
      if (row.source === "App") return isTuk ? `Tuk App (${row.platform})` : `App (${row.platform})`;
      return isTuk ? "Tuk (Manual)" : "Manual/Portal";
    },
  },
  { header: "Customer", dataKey: "customer" },
  { header: "Contact", dataKey: "contact" },
  { header: "Pickup Time", dataKey: "pickupTime" },
  { header: "Dispatched By", dataKey: "dispatchedBy" },
  { header: "Dispatched Time", dataKey: "dispatchedTime" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Organization", dataKey: "organization" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Pickup Address", dataKey: "pickup" },
  { header: "Booked By", dataKey: "bookedBy" },
  { header: "Fare Scheme", dataKey: "fareScheme" },
];

// ============================================
// STATISTICS (now uses live data)
// ============================================
function DispatchedStatistics({ data }: { data: DispatchedBooking[] }) {
  const stats = useMemo(() => {
    const portal = data.filter((d) => d.source === "Portal");
    const app = data.filter((d) => d.source === "App");
    const tuk = data.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = data.filter((d) => d.vehicleType !== "Tuk");

    return {
      total: data.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicleType === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicleType !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicleType === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicleType !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
    };
  }, [data]);

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by Source</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Combined view of all sources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manual / Portal</CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portal}</div>
              <p className="text-xs text-muted-foreground">
                {stats.portalNonTuk} regular + {stats.portalTuk} tuk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">App</CardTitle>
              <Smartphone className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.app}</div>
              <p className="text-xs text-muted-foreground">
                {stats.appNonTuk} regular + {stats.appTuk} tuk
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by Vehicle Type</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
              <Layers className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All vehicle types dispatched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
              <Car className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tuk}</div>
              <p className="text-xs text-muted-foreground">Three-wheeler dispatched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
              <Car className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nonTuk}</div>
              <p className="text-xs text-muted-foreground">Regular vehicles dispatched</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function DispatchedBookingsReport() {
  const [allDispatchedData, setAllDispatchedData] = useState<DispatchedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Optional (but nice): build filter options dynamically from loaded data
  const dispatchedByOptions = useMemo(() => {
    const unique = Array.from(new Set(allDispatchedData.map((d) => d.dispatchedBy).filter(Boolean)));
    return unique.sort();
  }, [allDispatchedData]);

  const vehicleTypeOptions = useMemo(() => {
    const unique = Array.from(new Set(allDispatchedData.map((d) => d.vehicleType).filter(Boolean))) as string[];
    return unique.sort();
  }, [allDispatchedData]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const bookings = await bookingService.searchAll({ status: BookingStatus.DISPATCHED });

        // Keep only dispatched
        const dispatchedOnly = (bookings || []).filter((b) => b.status === BookingStatus.DISPATCHED);

        setAllDispatchedData(dispatchedOnly.map(mapBookingToDispatched));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load dispatched bookings report");
        setAllDispatchedData([]);
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
      <DispatchedStatistics data={allDispatchedData} />

      <ReportPageTemplate
        title="Dispatched Bookings Audit Report"
        data={allDispatchedData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="customer"
        fileName="DispatchedBookings.pdf"
        filters={[
          {
            key: "source",
            label: "Booking Source",
            options: [
              { label: "All Sources", value: "all" },
              { label: "Manual / Portal", value: "Portal" },
              { label: "App", value: "App" },
            ],
            defaultValue: "all",
          },
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
              { label: "One Way", value: "One Way" },
              { label: "Round Trip", value: "Round Trip" },
              { label: "Hourly", value: "Hourly" },
              { label: "On The Meter", value: "On The Meter" },
              { label: "Fixed Rate", value: "Fixed Rate" },
              { label: "Package", value: "Package" },
            ],
            defaultValue: "all",
          },
          {
            key: "dispatchedBy",
            label: "Dispatched By",
            options: [
              { label: "All Staff", value: "all" },
              ...dispatchedByOptions.map((d) => ({ label: d, value: d })),
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}