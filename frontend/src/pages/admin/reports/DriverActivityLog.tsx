// src/pages/admin/reports/DriverActivityLog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Car,
  MapPin,
  Phone,
  Wifi,
  WifiOff,
  Users,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import axiosClient from "@/api/axiosClient";

// ============================================
// TYPE DEFINITION (same as your report)
// ============================================
export type DriverActivity = {
  id: string;
  code: string;
  firstName: string;
  contactNumber: string;
  vehicleCode: string;
  vehicleModel: string;
  lastLocation: string;
  totalOnlineDuration: string;
  searchField?: string;
  onlineStatus: "Online" | "Offline";
  durationMinutes: number;
};

// ============================================
// API TYPES (minimal, based on your ViewActivityLog page)
// ============================================
type DriverApi = {
  id: number;
  code?: string;
  firstName?: string;
  contactNumber?: string;
};

type ActivityLogApi = {
  id: number;
  driverId: number;
  driverCode?: string;
  driverName?: string;
  activityType?: string; // ONLINE / OFFLINE
  vehicleCode?: string;
  location?: string;
  logDate?: string; // or createdAt
  createdAt?: string;
  totalOnlineDuration?: number | null; // minutes
  vehicleModel?: string; // if exists in your backend
};

// ============================================
// HELPERS
// ============================================
function extractArray(responseData: any): any[] {
  if (Array.isArray(responseData)) return responseData;
  if (responseData?.data && Array.isArray(responseData.data)) return responseData.data;
  if (responseData?.data?.content && Array.isArray(responseData.data.content)) return responseData.data.content;
  if (responseData?.content && Array.isArray(responseData.content)) return responseData.content;
  return [];
}

// minutes -> "8h 45m"
function formatDuration(minutes: number | null): string {
  if (minutes === null || minutes === undefined) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function getOnlineStatusBadge(status: string) {
  if (status === "Online") return "bg-green-100 text-green-800 border-green-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function getVehicleTypeBadge(vehicleCode: string) {
  if ((vehicleCode || "").startsWith("LUX")) return "bg-purple-100 text-purple-800";
  if ((vehicleCode || "").startsWith("VAN")) return "bg-blue-100 text-blue-800";
  if ((vehicleCode || "").startsWith("TUK")) return "bg-yellow-100 text-yellow-800";
  if ((vehicleCode || "").startsWith("ECO")) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

// pick newest log (by logDate/createdAt)
function pickLatestLog(logs: ActivityLogApi[]): ActivityLogApi | undefined {
  if (!logs.length) return undefined;

  const getTime = (l: ActivityLogApi) => {
    const t = l.logDate || l.createdAt;
    const d = t ? new Date(t) : null;
    const ms = d && !isNaN(d.getTime()) ? d.getTime() : 0;
    return ms;
  };

  return [...logs].sort((a, b) => getTime(b) - getTime(a))[0];
}

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<DriverActivity>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            row.original.onlineStatus === "Online"
              ? "bg-green-500 animate-pulse"
              : "bg-gray-400"
          }`}
        />
        <span className="font-mono font-semibold text-purple-700">
          {row.getValue("code")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <span className="font-bold text-black">First Name</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-semibold text-xs">
            {(row.getValue("firstName") as string)?.[0] || "-"}
          </span>
        </div>
        <span className="font-medium">{row.getValue("firstName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: () => <span className="font-bold text-black">Contact Number</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-green-600" />
        <span>{row.getValue("contactNumber")}</span>
      </div>
    ),
  },
  {
    accessorKey: "vehicleCode",
    header: () => <span className="font-bold text-black">Vehicle Code</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className={getVehicleTypeBadge(row.getValue("vehicleCode"))}>
        <Car className="h-3 w-3 mr-1" />
        {row.getValue("vehicleCode")}
      </Badge>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: () => <span className="font-bold text-black">Vehicle Model</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("vehicleModel")}
      </span>
    ),
  },
  {
    accessorKey: "lastLocation",
    header: () => <span className="font-bold text-black">Last Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-blue-500" />
        <span>{row.getValue("lastLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalOnlineDuration",
    header: () => <span className="font-bold text-black">Total Online Duration</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-orange-500" />
        <Badge variant="secondary" className="font-mono">
          {row.getValue("totalOnlineDuration")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "onlineStatus",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className={getOnlineStatusBadge(row.getValue("onlineStatus"))}>
        {row.getValue("onlineStatus") === "Online" ? (
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3" /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <WifiOff className="h-3 w-3" /> Offline
          </span>
        )}
      </Badge>
    ),
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Code", dataKey: "code" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Contact Number", dataKey: "contactNumber" },
  { header: "Vehicle Code", dataKey: "vehicleCode" },
  { header: "Vehicle Model", dataKey: "vehicleModel" },
  { header: "Last Location", dataKey: "lastLocation" },
  { header: "Total Online Duration", dataKey: "totalOnlineDuration" },
  { header: "Status", dataKey: "onlineStatus" },
];

// ============================================
// STATISTICS COMPONENT (uses loaded data)
// ============================================
function ActivityStatistics({ data }: { data: DriverActivity[] }) {
  const stats = useMemo(() => {
    const totalMinutes = data.reduce((sum, d) => sum + (d.durationMinutes || 0), 0);
    const online = data.filter((d) => d.onlineStatus === "Online").length;
    const offline = data.filter((d) => d.onlineStatus === "Offline").length;

    return {
      total: data.length,
      online,
      offline,
      avgDuration:
        data.length > 0
          ? formatDuration(Math.round(totalMinutes / data.length))
          : "0h 00m",
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All logged drivers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Online Now</CardTitle>
          <Wifi className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.online}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Offline</CardTitle>
          <WifiOff className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.offline}</div>
          <p className="text-xs text-muted-foreground">Currently inactive</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-50/50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Online Time</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.avgDuration}</div>
          <p className="text-xs text-muted-foreground">Per driver average</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated like ViewActivityLog)
// ============================================
export default function DriverActivityLog() {
  const [allActivityData, setAllActivityData] = useState<DriverActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) fetch all drivers
        const driversRes = await axiosClient.get("/api/drivers", {
          params: { page: 0, size: 1000 },
        });
        const drivers: DriverApi[] = extractArray(driversRes.data);

        if (!drivers.length) {
          setAllActivityData([]);
          return;
        }

        // 2) fetch logs for each driver
        const rows: DriverActivity[] = [];

        const results = await Promise.allSettled(
          drivers.map(async (driver) => {
            const logsRes = await axiosClient.get(
              `/api/driver-activity-logs/driver/${driver.id}`,
              {
                params: {
                  page: 0,
                  size: 50,
                  sortBy: "createdAt",
                  sortDir: "desc",
                },
              }
            );

            const logs: ActivityLogApi[] = extractArray(logsRes.data);
            const latest = pickLatestLog(logs);

            // If no logs, skip (or you can still include driver with defaults)
            if (!latest) return;

            const onlineStatus: "Online" | "Offline" =
              String(latest.activityType || "").toUpperCase() === "ONLINE"
                ? "Online"
                : "Offline";

            const durationMinutes = latest.totalOnlineDuration ?? 0;

            rows.push({
              id: String(latest.id ?? driver.id),
              code: driver.code || latest.driverCode || "-",
              firstName: driver.firstName || (latest.driverName || "-").split(" ")[0] || "-",
              contactNumber: driver.contactNumber || "-",
              vehicleCode: latest.vehicleCode || "-",
              vehicleModel: latest.vehicleModel || "-", // if backend doesn't provide, stays "-"
              lastLocation: latest.location || "-",
              totalOnlineDuration: formatDuration(durationMinutes),
              onlineStatus,
              durationMinutes: durationMinutes || 0,
              searchField: `${driver.code || ""} ${driver.firstName || ""} ${latest.vehicleCode || ""}`,
            });
          })
        );

        // ignore results errors; rows already contains what succeeded
        setAllActivityData(rows);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load driver activity report");
        setAllActivityData([]);
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
      <ActivityStatistics data={allActivityData} />

      <ReportPageTemplate
        title="Driver Activity Log Audit Report"
        data={allActivityData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="DriverActivityLog.pdf"
        filters={[
          {
            key: "onlineStatus",
            label: "Status",
            options: [
              { label: "All Drivers", value: "all" },
              { label: "Online Only", value: "Online" },
              { label: "Offline Only", value: "Offline" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}