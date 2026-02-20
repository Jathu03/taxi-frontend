// src/pages/admin/reports/DeviceDetailsReport.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wifi,
  WifiOff,
  Truck,
  User,
  Smartphone,
  Tablet,
  Radio,
  CalendarCheck2,
  CalendarX2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import deviceService from "@/services/devices/deviceService";
import type { DeviceResponse } from "@/services/devices/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
export type Device = {
  id: string;
  deviceId: string;
  deviceType: "Mobile - Android" | "Mobile - iOS" | "Tablet" | "Tracker Unit";
  driverName: string;
  vehicleReg: string;
  status: "Active" | "Inactive";
  lastActive: string;
  installDate: string;
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractDeviceList(response: any): DeviceResponse[] {
  let devicesList: DeviceResponse[] = [];

  if (response?.content) {
    devicesList = response.content;
  } else if (response?.data?.content) {
    devicesList = response.data.content;
  } else if (Array.isArray(response)) {
    devicesList = response;
  } else if (Array.isArray(response?.data)) {
    devicesList = response.data;
  }

  return devicesList;
}

// Updated to accept any type (string | null | Date | undefined)
function toLocal(dt: any) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
}

// Updated to accept any type
function toDateOnly(dt: any) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function normalizeDeviceType(type?: string): Device["deviceType"] {
  const t = (type || "").toUpperCase();
  if (t.includes("ANDROID")) return "Mobile - Android";
  if (t.includes("IOS")) return "Mobile - iOS";
  if (t.includes("TABLET")) return "Tablet";
  if (t.includes("TRACKER")) return "Tracker Unit";
  return "Mobile - Android"; // fallback
}

function mapApiToReportRow(d: DeviceResponse): Device {
  // Cast d to any to safely access properties that might be optional/null in strict types
  const raw = d as any; 

  const deviceType = normalizeDeviceType(raw.deviceType);
  const status = raw.status === "Active" ? "Active" : "Inactive"; 

  return {
    id: String(raw.id),
    deviceId: raw.deviceId || "N/A",
    deviceType,
    driverName: raw.driverName || raw.driver?.name || "N/A",
    vehicleReg: raw.vehicleReg || raw.vehicle?.registrationNumber || "N/A",
    status,
    
    // Safely handle lastActive
    lastActive: toLocal(raw.lastActive),
    
    // installDate might be `createdAt` or specific field
    installDate: toDateOnly(raw.installDate || raw.createdAt),
    
    searchField: `${raw.deviceId} ${raw.deviceModel || ''} ${raw.serialNumber || ''}`,
  };
}

// ============================================
// TABLE COLUMNS (unchanged format)
// ============================================
const tableColumns: ColumnDef<Device>[] = [
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
    accessorKey: "deviceId",
    header: () => <span className="font-bold text-black">Device ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("deviceId")}
      </span>
    ),
  },
  {
    accessorKey: "deviceType",
    header: () => <span className="font-bold text-black">Device Type</span>,
    cell: ({ row }) => {
      const type = row.getValue("deviceType") as string;
      const iconMap: Record<string, ReactNode> = {
        "Mobile - Android": <Smartphone className="h-4 w-4 text-green-600" />,
        "Mobile - iOS": <Smartphone className="h-4 w-4 text-blue-600" />,
        Tablet: <Tablet className="h-4 w-4 text-purple-600" />,
        "Tracker Unit": <Radio className="h-4 w-4 text-orange-600" />,
      };
      return (
        <div className="flex items-center gap-2">
          {iconMap[type] || (
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          )}
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "driverName",
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-blue-500" />
        {row.getValue("driverName")}
      </div>
    ),
  },
  {
    accessorKey: "vehicleReg",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Truck className="h-3 w-3 text-green-600" />
        <span className="font-mono text-sm font-bold">
          {row.getValue("vehicleReg")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === "Active";
      return (
        <Badge
          variant="outline"
          className={
            isActive
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }
        >
          {isActive ? (
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: () => <span className="font-bold text-black">Last Active</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarX2 className="h-3 w-3" />
        {row.getValue("lastActive")}
      </div>
    ),
  },
  {
    accessorKey: "installDate",
    header: () => <span className="font-bold text-black">Install Date</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarCheck2 className="h-3 w-3" />
        {row.getValue("installDate")}
      </div>
    ),
  },
];

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Device ID", dataKey: "deviceId" },
  { header: "Type", dataKey: "deviceType" },
  { header: "Driver", dataKey: "driverName" },
  { header: "Vehicle", dataKey: "vehicleReg" },
  { header: "Status", dataKey: "status" },
  { header: "Last Active", dataKey: "lastActive" },
  { header: "Installed", dataKey: "installDate" },
];

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function DeviceDetailsReport() {
  const [allDeviceData, setAllDeviceData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        setLoading(true);

        // Fetch all devices (using same size param as ManageDevices)
        const response: any = await deviceService.getAll({ size: 1000 });
        const rawList = extractDeviceList(response);

        setAllDeviceData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load device details report");
        setAllDeviceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
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
      title="Device Details Audit Report"
      data={allDeviceData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
      searchKey="searchField"
      fileName="DeviceReport.pdf"
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "All Devices", value: "all" },
            { label: "Active Only", value: "Active" },
            { label: "Inactive Only", value: "Inactive" },
          ],
          defaultValue: "all",
        },
        {
          key: "deviceType",
          label: "Device Type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Android", value: "Mobile - Android" },
            { label: "iOS", value: "Mobile - iOS" },
            { label: "Tablet", value: "Tablet" },
            { label: "Tracker", value: "Tracker Unit" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}