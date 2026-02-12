"use client";
import { type ReactNode } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
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
// MOCK DATA
// ============================================
const mockDevices: Device[] = [
  {
    id: "d1",
    deviceId: "DEV-001",
    deviceType: "Mobile - Android",
    driverName: "Sunil Silva",
    vehicleReg: "CAB-1234",
    status: "Active",
    lastActive: "2024-11-28 08:30 AM",
    installDate: "2023-11-15",
  },
  {
    id: "d2",
    deviceId: "DEV-002",
    deviceType: "Tablet",
    driverName: "Kamal Perera",
    vehicleReg: "VAN-4567",
    status: "Inactive",
    lastActive: "2024-10-01 06:00 PM",
    installDate: "2023-11-05",
  },
  {
    id: "d3",
    deviceId: "DEV-003",
    deviceType: "Mobile - iOS",
    driverName: "Shanaka Fernando",
    vehicleReg: "LUX-9898",
    status: "Active",
    lastActive: "2024-12-03 11:45 AM",
    installDate: "2024-01-10",
  },
  {
    id: "d4",
    deviceId: "DEV-004",
    deviceType: "Tracker Unit",
    driverName: "Ravi Jayasuriya",
    vehicleReg: "TUK-5566",
    status: "Inactive",
    lastActive: "2024-09-15 01:22 AM",
    installDate: "2023-10-10",
  },
  {
    id: "d5",
    deviceId: "DEV-005",
    deviceType: "Mobile - Android",
    driverName: "Nimal Bandara",
    vehicleReg: "CAB-5678",
    status: "Active",
    lastActive: "2024-12-05 09:15 AM",
    installDate: "2024-02-20",
  },
  {
    id: "d6",
    deviceId: "DEV-006",
    deviceType: "Tablet",
    driverName: "Pradeep Kumar",
    vehicleReg: "VAN-8901",
    status: "Active",
    lastActive: "2024-12-04 03:30 PM",
    installDate: "2024-03-15",
  },
];

const allDeviceData: Device[] = mockDevices.map((d) => ({
  ...d,
  searchField: `${d.deviceId} ${d.driverName} ${d.vehicleReg} ${d.deviceType}`,
}));

// ============================================
// TABLE COLUMNS
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
          {iconMap[type] || <Smartphone className="h-4 w-4 text-muted-foreground" />}
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
          className={`${isActive
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
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
// MAIN COMPONENT
// ============================================
export default function DeviceDetailsReport() {
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