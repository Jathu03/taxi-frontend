// src/pages/admin/reports/DriverReport.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Phone,
  MapPin,
  Smartphone,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// --- Services & Types (same as ManageDrivers) ---
import driverService from "@/services/drivers/driverService";
import type { DriverResponse } from "@/services/drivers/types";

// ============================================
// TYPE DEFINITION (Report shape)
// ============================================
export type Driver = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  emergencyContactNumber: string;
  manualDispatch: "Yes" | "No";
  blocked: "Yes" | "No";
  lastLocation: string;
  appVersion: string;
  fullName: string;
};

// ============================================
// EXTRACT LIST (same strategy as ManageDrivers)
// ============================================
function extractDriversList(response: any): DriverResponse[] {
  let driversList: DriverResponse[] = [];

  // STRATEGY 1: Custom ApiResponse wrapper
  if (response?.success === true && response?.data) {
    if (Array.isArray(response.data)) {
      driversList = response.data;
    } else if (Array.isArray(response.data?.content)) {
      driversList = response.data.content;
    }
  }
  // STRATEGY 2: Direct Spring Page
  else if (Array.isArray(response?.content)) {
    driversList = response.content;
  }
  // STRATEGY 3: Direct Array
  else if (Array.isArray(response)) {
    driversList = response;
  }

  return driversList;
}

// ============================================
// MAPPER: DriverResponse -> Driver (Report Row)
// ============================================
function mapDriverToReportRow(d: DriverResponse): Driver {
  const firstName = d.firstName || "";
  const lastName = d.lastName || "";

  return {
    id: String(d.id),
    code: d.code || "-",
    firstName: firstName || "-",
    lastName: lastName || "-",
    nic: (d as any).nic || "-",
    contactNumber: d.contactNumber || "-",
    emergencyContactNumber: (d as any).emergencyContactNumber || "-",
    manualDispatch: d.manualDispatchOnly ? "Yes" : "No",
    blocked: d.isBlocked ? "Yes" : "No",

    // If your backend has a real field name, add it here.
    lastLocation:
      (d as any).lastLocation ||
      (d as any).currentLocation ||
      (d as any).lastKnownLocation ||
      "-",

    appVersion: (d as any).appVersion || "-",
    fullName: `${firstName} ${lastName}`.trim() || "-",
  };
}

// ============================================
// HELPER FUNCTIONS (same as your mock version)
// ============================================
const getBlockedBadge = (blocked: string) =>
  blocked === "Yes"
    ? "bg-red-100 text-red-800 border-red-200"
    : "bg-green-100 text-green-800 border-green-200";

const getManualDispatchBadge = (manual: string) =>
  manual === "Yes"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<Driver>[] = [
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
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <span className="font-bold text-black">First Name</span>,
  },
  {
    accessorKey: "lastName",
    header: () => <span className="font-bold text-black">Last Name</span>,
  },
  {
    accessorKey: "fullName",
    header: () => <span className="font-bold text-black">Full Name</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-semibold text-xs">
            {row.original.firstName?.[0] || "-"}
            {row.original.lastName?.[0] || "-"}
          </span>
        </div>
        <span className="font-medium">{row.getValue("fullName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "nic",
    header: () => <span className="font-bold text-black">NIC</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("nic")}</span>
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
    accessorKey: "emergencyContactNumber",
    header: () => (
      <span className="font-bold text-black">Emergency Contact</span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-red-500" />
        <span className="text-muted-foreground">
          {row.getValue("emergencyContactNumber")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "manualDispatch",
    header: () => <span className="font-bold text-black">Manual Dispatch</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getManualDispatchBadge(row.getValue("manualDispatch"))}
      >
        {row.getValue("manualDispatch")}
      </Badge>
    ),
  },
  {
    accessorKey: "blocked",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getBlockedBadge(row.getValue("blocked"))}
      >
        {row.getValue("blocked") === "Yes" ? (
          <span className="flex items-center gap-1">
            <UserX className="h-3 w-3" /> Blocked
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" /> Active
          </span>
        )}
      </Badge>
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
    accessorKey: "appVersion",
    header: () => <span className="font-bold text-black">App Ver</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Smartphone className="h-3 w-3 text-muted-foreground" />
        <Badge variant="secondary" className="text-xs">
          v{row.getValue("appVersion")}
        </Badge>
      </div>
    ),
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Code", dataKey: "code" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Last Name", dataKey: "lastName" },
  { header: "NIC", dataKey: "nic" },
  { header: "Contact", dataKey: "contactNumber" },
  { header: "Emergency", dataKey: "emergencyContactNumber" },
  { header: "Manual", dataKey: "manualDispatch" },
  {
    header: "Status",
    dataKey: "blocked",
    formatter: (value: string) => (value === "Yes" ? "Blocked" : "Active"),
  },
  { header: "Location", dataKey: "lastLocation" },
  { header: "App Ver", dataKey: "appVersion" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function DriverStatistics({ data }: { data: Driver[] }) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((d) => d.blocked === "No").length,
      blocked: data.filter((d) => d.blocked === "Yes").length,
      manualDispatch: data.filter((d) => d.manualDispatch === "Yes").length,
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
          <p className="text-xs text-muted-foreground">All registered drivers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Blocked Drivers</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          <p className="text-xs text-muted-foreground">Currently blocked</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Manual Dispatch</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.manualDispatch}
          </div>
          <p className="text-xs text-muted-foreground">Enabled for manual</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function DriverReport() {
  const [allDriverData, setAllDriverData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);

        // Same as ManageDrivers
        const response: any = await driverService.getAll({ size: 1000 });
        const driversList = extractDriversList(response);

        setAllDriverData(driversList.map(mapDriverToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load driver report");
        setAllDriverData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
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
      <DriverStatistics data={allDriverData} />

      <ReportPageTemplate
        title="Driver Registry Audit Report"
        data={allDriverData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="fullName"
        fileName="DriverReport.pdf"
        filters={[
          {
            key: "blocked",
            label: "Status",
            options: [
              { label: "All Drivers", value: "all" },
              { label: "Active Only", value: "No" },
              { label: "Blocked Only", value: "Yes" },
            ],
            defaultValue: "all",
          },
          {
            key: "manualDispatch",
            label: "Dispatch Type",
            options: [
              { label: "All Types", value: "all" },
              { label: "Manual Dispatch", value: "Yes" },
              { label: "Auto Dispatch", value: "No" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}