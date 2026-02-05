// src/pages/DeviceDetailsReport.tsx

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Monitor,
  Wifi,
  WifiOff,
  CalendarCheck2,
  CalendarX2,
  Truck,
  User,
  Smartphone,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type Device = {
  id: string;
  deviceId: string;
  deviceType: string;
  driverName: string;
  vehicleReg: string;
  status: "Active" | "Inactive";
  lastActive: string;
  installDate: string;
  searchField?: string;
};

// --- Mock Data ---
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
];

// --- Column Definitions ---
const columns: ColumnDef<Device>[] = [
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
    header: "Device ID",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("deviceId")}
      </span>
    ),
  },
  {
    accessorKey: "deviceType",
    header: "Device Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-muted-foreground" />
        {row.getValue("deviceType")}
      </div>
    ),
  },
  {
    accessorKey: "driverName",
    header: "Driver",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-blue-500" />
        {row.getValue("driverName")}
      </div>
    ),
  },
  {
    accessorKey: "vehicleReg",
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Truck className="h-3 w-3 text-green-600" />
        <span className="font-mono text-sm">{row.getValue("vehicleReg")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === "Active";
      return (
        <Badge
          variant="outline"
          className={`${
            isActive
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
    header: "Last Active",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarX2 className="h-3 w-3" />
        {row.getValue("lastActive")}
      </div>
    ),
  },
  {
    accessorKey: "installDate",
    header: "Install Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarCheck2 className="h-3 w-3" />
        {row.getValue("installDate")}
      </div>
    ),
  },
];

// --- Component ---
export default function DeviceDetailsReport() {
  const [data] = useState<Device[]>(
    mockDevices.map((d) => ({
      ...d,
      searchField: `${d.deviceId} ${d.driverName}`,
    }))
  );

  // Export CSV
  const exportCSV = () => {
    const headers =
      "Device ID,Device Type,Driver,Vehicle,Status,Last Active,Install Date";
    const rows = data.map(
      (d) =>
        `${d.deviceId},${d.deviceType},${d.driverName},${d.vehicleReg},${d.status},${d.lastActive},${d.installDate}`
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "device_report.csv";
    a.click();
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Device Details Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      head: [
        [
          "Device ID",
          "Type",
          "Driver",
          "Vehicle",
          "Status",
          "Last Active",
          "Installed",
        ],
      ],
      body: data.map((d) => [
        d.deviceId,
        d.deviceType,
        d.driverName,
        d.vehicleReg,
        d.status,
        d.lastActive,
        d.installDate,
      ]),
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("device_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Device Details Report</h1>
          <p className="text-muted-foreground mt-1">Overview of all assigned devices</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-100"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Monitor className="h-5 w-5" />
            Device Records
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {data.length} Devices
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search by device ID or driver name..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}