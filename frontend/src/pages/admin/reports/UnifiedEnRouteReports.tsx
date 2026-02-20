"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Car, Navigation, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// ============================================
// TYPE DEFINITION (same format)
// ============================================
export type EnRouteBooking = {
  id: string;
  refNumber: string;
  customer: string;
  driver: string;
  vehicle: string;
  vehicleType?: string;
  pickup: string;
  currentLocation: string;
  eta: string;
  status: "EnRoute";
};

// ============================================
// HELPERS
// ============================================

const TUK_CLASS_ID = 8;

function normalizeVehicleType(b: BookingResponse): string {
  if (Number(b.vehicleClassId) === TUK_CLASS_ID) return "Tuk";
  return (
    b.vehicleClassName ||
    b.vehicleClassCode ||
    `Class ${b.vehicleClassId ?? "N/A"}`
  );
}

function parseEtaMinutes(eta: string): number | null {
  if (!eta) return null;
  // Examples it can handle:
  // "5 mins", "3 min", "12", "ETA: 7 mins"
  const m = eta.match(/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

const getVehicleBadgeClass = (vehicleType: string) => {
  const key = (vehicleType || "").trim();
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    BUS: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    LUXURY: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    VAN: "bg-slate-100 text-slate-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    TUK: "bg-yellow-100 text-yellow-800",
  };
  return colorMap[key] || "bg-gray-100 text-gray-800";
};

const getETABadgeClass = (eta: string) => {
  const minutes = parseEtaMinutes(eta);
  if (minutes === null) return "bg-gray-100 text-gray-800 border-gray-200";
  if (minutes <= 3) return "bg-green-100 text-green-800 border-green-300";
  if (minutes <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-orange-100 text-orange-800 border-orange-300";
};

function mapBookingToEnrouteRow(b: BookingResponse): EnRouteBooking {
  return {
    id: String(b.id),
    refNumber: b.bookingId || String(b.id),
    customer: b.customerName || "N/A",
    driver: b.driverName || b.driverCode || "N/A",
    vehicle: b.vehicleRegistrationNumber || b.vehicleCode || "—",
    vehicleType: normalizeVehicleType(b),
    pickup: b.pickupAddress || "N/A",
    currentLocation: b.currentLocation || b.pickupAddress || "N/A",
    eta: b.eta || "—",
    status: "EnRoute",
  };
}

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const selectColumn: ColumnDef<EnRouteBooking> = {
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

const tableColumns: ColumnDef<EnRouteBooking>[] = [
  selectColumn,
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("customer")}</div>,
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
      const vehicleType = row.original.vehicleType as string;
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
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue("pickup")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: () => <span className="font-bold text-black">Current Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
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
// EXPORT COLUMNS (same format)
// ============================================
const exportColumns = [
  { header: "Booking ID", dataKey: "refNumber" },
  { header: "Customer", dataKey: "customer" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Pickup", dataKey: "pickup" },
  { header: "Current Location", dataKey: "currentLocation" },
  { header: "ETA", dataKey: "eta" },
];

// ============================================
// STATISTICS COMPONENT (now uses live data)
// ============================================
function EnRouteStatistics({ data }: { data: EnRouteBooking[] }) {
  const stats = useMemo(() => {
    const tuk = data.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = data.filter((d) => d.vehicleType !== "Tuk");

    const urgent = data.filter((d) => (parseEtaMinutes(d.eta) ?? 999999) <= 3);
    const near = data.filter((d) => {
      const m = parseEtaMinutes(d.eta);
      return m !== null && m > 3 && m <= 7;
    });
    const approaching = data.filter((d) => (parseEtaMinutes(d.eta) ?? -1) > 7);

    return {
      total: data.length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      urgent: urgent.length,
      near: near.length,
      approaching: approaching.length,
    };
  }, [data]);

  return (
    <div className="space-y-4 mb-6">
      {/* ETA Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Arriving Soon
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.urgent}</div>
            <p className="text-xs text-green-600">≤ 3 minutes</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Near Pickup
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-yellow-600">4–7 minutes</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Approaching
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.approaching}</div>
            <p className="text-xs text-orange-600">&gt; 7 minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Type Statistics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Vehicle Type
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
              <Layers className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All vehicle types enroute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
              <Car className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tuk}</div>
              <p className="text-xs text-muted-foreground">Three-wheelers enroute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
              <Car className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nonTuk}</div>
              <p className="text-xs text-muted-foreground">Regular vehicles enroute</p>
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
export default function EnRouteBookingsReport() {
  const [allEnRouteData, setAllEnRouteData] = useState<EnRouteBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const vehicleTypeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(allEnRouteData.map((d) => d.vehicleType).filter(Boolean))
    ) as string[];
    return unique.sort();
  }, [allEnRouteData]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const bookings = await bookingService.searchAll({
          status: BookingStatus.ENROUTE,
        });

        // Safety filter
        const enrouteOnly = (bookings || []).filter(
          (b) => b.status === BookingStatus.ENROUTE
        );

        setAllEnRouteData(enrouteOnly.map(mapBookingToEnrouteRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load EnRoute bookings report");
        setAllEnRouteData([]);
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
      <EnRouteStatistics data={allEnRouteData} />

      <ReportPageTemplate
        title="EnRoute Bookings Audit Report"
        data={allEnRouteData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="customer"
        fileName="EnRouteBookings.pdf"
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