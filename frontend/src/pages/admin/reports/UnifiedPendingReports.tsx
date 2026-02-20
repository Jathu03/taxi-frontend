"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Smartphone, Globe, Car, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION (unchanged format)
// ============================================
export type UnifiedBooking = {
  id: string;
  refNumber: string;
  customer: string;
  contact: string;
  pickup: string;
  drop: string;
  vehicle: string;
  dateTime: string;
  source: "Portal" | "App";
  platform?: "Android" | "iOS";
  organization?: string;
  bookedBy?: string;
  pickupTime?: string;
  status: "Pending";
  hireType?: string;
  clientRemarks?: string;
  isAdvance?: string;
  bookingTime?: string;
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

function isTuk(b: BookingResponse): boolean {
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return true;
  const name = (b.vehicleClassName || "").toUpperCase();
  return name.includes("TUK");
}

function inferSource(b: BookingResponse): "Portal" | "App" {
  const src = (b.bookingSource || "").toUpperCase().trim();
  const platform = (b.appPlatform || "").toUpperCase().trim();

  // Primary: bookingSource
  if (src === "MOBILE_APP") return "App";

  // Fallback: appPlatform present and not WEB => App
  if (platform && platform !== "WEB") return "App";

  return "Portal";
}

function inferPlatform(b: BookingResponse): "Android" | "iOS" | undefined {
  const platform = (b.appPlatform || "").toUpperCase();
  if (!platform) return undefined;
  if (platform.includes("IOS")) return "iOS";
  if (platform.includes("ANDROID")) return "Android";
  return undefined;
}

function normalizeVehicleName(b: BookingResponse): string {
  // prefer backend-enriched name
  const name = b.vehicleClassName || b.vehicleClassCode || "";
  if (isTuk(b)) return "Tuk";
  return name || `Class ${b.vehicleClassId ?? "N/A"}`;
}

const getVehicleBadgeClass = (vehicle: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    TUK: "bg-yellow-100 text-yellow-800",
    VAN: "bg-slate-100 text-slate-800",
  };
  return colorMap[vehicle] || "bg-gray-100 text-gray-800";
};

function mapBookingToUnified(b: BookingResponse): UnifiedBooking {
  const source = inferSource(b);
  const platform = source === "App" ? inferPlatform(b) : undefined;

  const pickupTime = toLocal(b.pickupTime);
  const bookingTime = toLocal(b.bookingTime);

  // dateTime shown in table (keep same field name)
  // Prefer pickupTime if exists, else bookingTime
  const dateTime = pickupTime || bookingTime || "";

  return {
    id: String(b.id),
    refNumber: b.bookingId || String(b.id),
    customer: b.customerName || "N/A",
    contact: b.contactNumber || "N/A",
    pickup: b.pickupAddress || "N/A",
    drop: b.dropAddress || b.destination || "N/A",
    vehicle: normalizeVehicleName(b),
    dateTime,
    source,
    platform,
    status: "Pending",
    organization: b.corporateName || "",
    bookedBy: b.bookedByName || "System",
    pickupTime,
    bookingTime,
    hireType: b.hireType || "",
    clientRemarks: b.clientRemarks || b.remarks || "",
    isAdvance: b.isAdvanceBooking ? "Yes" : "No",
  };
}

// ============================================
// TABLE COLUMNS (unchanged format)
// ============================================

const selectColumn: ColumnDef<UnifiedBooking> = {
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
};

const tableColumns: ColumnDef<UnifiedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Ref ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "source",
    header: () => <span className="font-bold text-black">Source</span>,
    cell: ({ row }) => {
      const source = row.original.source;
      const platform = row.original.platform;
      const vehicle = row.original.vehicle;
      const isTukVehicle = vehicle === "Tuk";

      if (source === "App") {
        return (
          <Badge
            variant="outline"
            className={`gap-1 ${
              isTukVehicle
                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                : platform === "iOS"
                  ? "border-gray-500 text-gray-700 bg-gray-50"
                  : "border-green-600 text-green-700 bg-green-50"
            }`}
          >
            {isTukVehicle ? <Car className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
            {isTukVehicle ? `Tuk App (${platform ?? "Unknown"})` : `App (${platform ?? "Unknown"})`}
          </Badge>
        );
      }

      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            isTukVehicle
              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
              : "border-blue-500 text-blue-700 bg-blue-50"
          }`}
        >
          {isTukVehicle ? <Car className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {isTukVehicle ? "Tuk (Manual)" : "Manual/Portal"}
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
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  { accessorKey: "pickup", header: () => <span className="font-bold text-black">Pickup</span> },
  { accessorKey: "drop", header: () => <span className="font-bold text-black">Drop</span> },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dateTime",
    header: () => <span className="font-bold text-black">Date/Time</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("dateTime")}
      </span>
    ),
  },
];

// ============================================
// EXPORT COLUMNS (unchanged format)
// ============================================

const exportColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  {
    header: "Source",
    dataKey: "source",
    formatter: (value: string, row: UnifiedBooking) => {
      const isTukVehicle = row.vehicle === "Tuk";
      if (row.source === "App") {
        return isTukVehicle ? `Tuk App (${row.platform})` : `App (${row.platform})`;
      }
      return isTukVehicle ? "Tuk (Manual)" : "Manual/Portal";
    },
  },
  { header: "Customer", dataKey: "customer" },
  { header: "Contact", dataKey: "contact" },
  { header: "Pickup", dataKey: "pickup" },
  { header: "Drop", dataKey: "drop" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Date/Time", dataKey: "dateTime" },
  { header: "Organization", dataKey: "organization" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Client Remarks", dataKey: "clientRemarks" },
  { header: "Booked By", dataKey: "bookedBy" },
  { header: "Is Advance", dataKey: "isAdvance" },
];

// ============================================
// STATISTICS COMPONENT (now uses live data)
// ============================================

function PendingStatistics({ data }: { data: UnifiedBooking[] }) {
  const stats = useMemo(() => {
    const portal = data.filter((d) => d.source === "Portal");
    const app = data.filter((d) => d.source === "App");
    const tuk = data.filter((d) => d.vehicle === "Tuk");
    const nonTuk = data.filter((d) => d.vehicle !== "Tuk");

    return {
      total: data.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicle === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicle !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicle === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicle !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
    };
  }, [data]);

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Source
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Combined view (intersection columns)
              </p>
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
              <Smartphone className="h-4 w-4 text-green-500" />
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Vehicle Type
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
              <Layers className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All vehicle types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
              <Car className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tuk}</div>
              <p className="text-xs text-muted-foreground">Three-wheeler bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
              <Car className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nonTuk}</div>
              <p className="text-xs text-muted-foreground">
                Bus, Luxury, Standard, Economy, etc.
              </p>
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

export default function PendingBookingsReport() {
  const [pendingData, setPendingData] = useState<UnifiedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPending = async () => {
      try {
        setLoading(true);

        // Get ALL pending bookings (portal + app + tuk + non-tuk)
        const bookings = await bookingService.searchAll({
          status: BookingStatus.PENDING,
        });

        const unified = (bookings || []).map(mapBookingToUnified);
        setPendingData(unified);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load pending bookings report");
        setPendingData([]);
      } finally {
        setLoading(false);
      }
    };

    loadPending();
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
      <PendingStatistics data={pendingData} />

      <ReportPageTemplate
        title="Pending Bookings Audit Report"
        data={pendingData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="customer"
        fileName="PendingBookings.pdf"
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
            key: "isAdvance",
            label: "Is Advance",
            options: [
              { label: "All", value: "all" },
              { label: "Advance Only", value: "Yes" },
              { label: "Immediate Only", value: "No" },
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
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}